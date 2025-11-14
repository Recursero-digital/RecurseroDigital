import { StudentRepository } from '../infrastructure/StudentRepository';
import { StudentStatisticsRepository } from '../infrastructure/StudentStatisticsRepository';
import { StudentStatistics } from '../models/StudentStatistics';
import { StudentNotFoundError } from '../models/exceptions/StudentNotFoundError';
import { AiTextGenerator } from '../services/AiTextGenerator';

export interface GenerateStudentReportRequest {
    studentId: string;
    recentDays?: number;
}

export interface GenerateStudentReportResponse {
    studentId: string;
    studentName: string;
    report: string;
    provider: string;
    model: string;
    recentDays: number;
    prompt: string;
    metadata: {
        totalRecords: number;
        timeframeStart: string;
        timeframeEnd: string;
        gamesCovered: number;
    };
    usedFallback: boolean;
}

interface GameAggregate {
    gameId: string;
    totalSessions: number;
    totalPoints: number;
    maxUnlockedLevel: number;
    completionRate: number;
    averageAccuracy: number;
    recentSessions: number;
    recentPoints: number;
    lastActivity: Date | null;
}

export class GenerateStudentReportUseCase {
    private readonly studentRepository: StudentRepository;
    private readonly statisticsRepository: StudentStatisticsRepository;
    private readonly aiTextGenerator: AiTextGenerator;

    constructor(
        studentRepository: StudentRepository,
        statisticsRepository: StudentStatisticsRepository,
        aiTextGenerator: AiTextGenerator
    ) {
        this.studentRepository = studentRepository;
        this.statisticsRepository = statisticsRepository;
        this.aiTextGenerator = aiTextGenerator;
    }

    async execute(request: GenerateStudentReportRequest): Promise<GenerateStudentReportResponse> {
        const student = await this.studentRepository.findById(request.studentId);

        if (!student) {
            throw new StudentNotFoundError();
        }

        const statistics = await this.statisticsRepository.findByStudent(request.studentId);
        const recentDays = request.recentDays ?? 7;
        const now = new Date();
        const windowStart = new Date(now.getTime() - recentDays * 24 * 60 * 60 * 1000);

        if (statistics.length === 0) {
            const fallbackReport = `No se encontraron estadísticas registradas para ${student.name} ${student.lastname}. ` +
                `Pide al estudiante que complete nuevas actividades para poder generar un informe.`;

            return {
                studentId: student.id,
                studentName: `${student.name} ${student.lastname}`,
                report: fallbackReport,
                provider: 'system',
                model: 'static-fallback',
                recentDays,
                prompt: '',
                metadata: {
                    totalRecords: 0,
                    timeframeStart: windowStart.toISOString(),
                    timeframeEnd: now.toISOString(),
                    gamesCovered: 0
                },
                usedFallback: true
            };
        }

        const aggregates = this.aggregateStatistics(statistics, windowStart);
        const anonymizedLabel = 'Estudiante anonimizado';
        const prompt =
            this.buildPrompt({
                studentName: anonymizedLabel,
                studentId: student.id,
                recentDays,
                stats: statistics,
                aggregates,
                windowStart,
                now
            });

        const result = await this.aiTextGenerator.generateText(prompt);

        return {
            studentId: student.id,
            studentName: `${student.name} ${student.lastname}`,
            report: result.text,
            provider: result.provider,
            model: result.model,
            recentDays,
            prompt,
            metadata: {
                totalRecords: statistics.length,
                timeframeStart: windowStart.toISOString(),
                timeframeEnd: now.toISOString(),
                gamesCovered: aggregates.length
            },
            usedFallback: false
        };
    }

    private aggregateStatistics(statistics: StudentStatistics[], windowStart: Date): GameAggregate[] {
        const gamesMap = new Map<string, StudentStatistics[]>();

        statistics.forEach((stat) => {
            if (!gamesMap.has(stat.gameId)) {
                gamesMap.set(stat.gameId, []);
            }
            gamesMap.get(stat.gameId)!.push(stat);
        });

        return Array.from(gamesMap.entries()).map(([gameId, stats]) => {
            const totalSessions = stats.length;
            const totalPoints = stats.reduce((sum, stat) => sum + stat.points, 0);
            const recentSessions = stats.filter((stat) => stat.createdAt >= windowStart).length;
            const recentPoints = stats
                .filter((stat) => stat.createdAt >= windowStart)
                .reduce((sum, stat) => sum + stat.points, 0);
            const maxUnlockedLevel = Math.max(...stats.map((stat) => stat.maxUnlockedLevel));
            const completionRate = (stats.filter((stat) => stat.isCompleted).length / totalSessions) * 100;
            const averageAccuracy = stats.reduce((sum, stat) => sum + stat.getAccuracy(), 0) / totalSessions * 100;
            const lastActivity = stats.reduce(
                (latest, current) => (current.createdAt > latest ? current.createdAt : latest),
                stats[0].createdAt
            );

            return {
                gameId,
                totalSessions,
                totalPoints,
                maxUnlockedLevel,
                completionRate,
                averageAccuracy,
                recentSessions,
                recentPoints,
                lastActivity
            };
        });
    }

    private buildPrompt(params: {
        studentName: string;
        studentId: string;
        recentDays: number;
        stats: StudentStatistics[];
        aggregates: GameAggregate[];
        windowStart: Date;
        now: Date;
    }): string {
        const { recentDays, stats, aggregates, windowStart, now } = params;

        const totalPoints = stats.reduce((sum, stat) => sum + stat.points, 0);
        const completedLevels = stats.filter((stat) => stat.isCompleted).length;
        const averageAccuracy = (stats.reduce((sum, stat) => sum + stat.getAccuracy(), 0) / stats.length) * 100;
        const totalAttempts = stats.reduce((sum, stat) => sum + stat.attempts, 0);
        const lastActivity = stats.reduce(
            (latest, current) => (current.createdAt > latest ? current.createdAt : latest),
            stats[0].createdAt
        );
        const recentStats = stats.filter((stat) => stat.createdAt >= windowStart);
        const recentPoints = recentStats.reduce((sum, stat) => sum + stat.points, 0);
        const recentAccuracy = recentStats.length > 0
            ? (recentStats.reduce((sum, stat) => sum + stat.getAccuracy(), 0) / recentStats.length) * 100
            : 0;

        const perGameLines = aggregates.map((game) => {
            const lastActivityDate = game.lastActivity ? this.formatDate(game.lastActivity) : 'Sin registros';
            return `Juego ${game.gameId}: sesiones=${game.totalSessions}, puntos=${game.totalPoints}, ` +
                `nivel_máximo=${game.maxUnlockedLevel}, precisión_promedio=${game.averageAccuracy.toFixed(1)}%, ` +
                `tasa_finalización=${game.completionRate.toFixed(1)}%, ` +
                `sesiones_recientes=${game.recentSessions}, puntos_recientes=${game.recentPoints}, ` +
                `última_actividad=${lastActivityDate}`;
        }).join('\n');

        return `Eres un tutor pedagógico que redacta reportes en español claro y breve.
Contexto: datos estadísticos de un estudiante de juegos en clase.
Registros analizados: ${stats.length}
Total de puntos acumulados: ${totalPoints}
Promedio general de precisión: ${averageAccuracy.toFixed(1)}%
Intentos totales: ${totalAttempts}
Niveles completados: ${completedLevels}
Última actividad registrada: ${this.formatDate(lastActivity)}

Resumen por juego:
${perGameLines}

Rendimiento de los últimos ${recentDays} días (desde ${this.formatDate(windowStart)} hasta ${this.formatDate(now)}):
- Sesiones registradas: ${recentStats.length}
- Puntos obtenidos: ${recentPoints}
- Precisión promedio reciente: ${recentAccuracy.toFixed(1)}%

Objetivo: genera un informe de máximo 4 párrafos que incluya
1) visión general del progreso del estudiante,
2) tendencias de los últimos días,
3) fortalezas detectadas,
4) sugerencias concretas de mejora para los próximos días.
Es para un docente. Devolve unicamente una respuesta pura en texto, dado que soy una api y necesito retornar un string. 
Por favor, retorna la respuesta sin estilo, ni emojis, ni negrita. Solo texto sin formato para procesar tu respuesta dentro de un string.`;
    }

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }
}

