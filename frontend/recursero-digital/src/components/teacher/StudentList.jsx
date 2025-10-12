import React, { useState, useEffect } from 'react';
import { /* getCourseStudents */ } from '../../services/teacherApi';
import '../styles/StudentList.css';

const StudentList = ({ courseId, onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all'); 

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setStudents([
            {
              id: "student_1",
              name: "Ana García",
              email: "ana.garcia@student.edu",
              enrollmentDate: "2024-01-15",
              totalGamesPlayed: 45,
              averageScore: 88,
              lastActivity: "2024-10-12T10:30:00Z",
              progressByGame: {
                ordenamiento: { completed: 15, totalTime: 450, averageScore: 92 },
                escritura: { completed: 12, totalTime: 360, averageScore: 85 },
                descomposicion: { completed: 10, totalTime: 300, averageScore: 90 },
                escala: { completed: 8, totalTime: 240, averageScore: 86 }
              }
            },
            {
              id: "student_2", 
              name: "Carlos López",
              email: "carlos.lopez@student.edu",
              enrollmentDate: "2024-01-15",
              totalGamesPlayed: 32,
              averageScore: 76,
              lastActivity: "2024-10-11T14:20:00Z",
              progressByGame: {
                ordenamiento: { completed: 10, totalTime: 350, averageScore: 78 },
                escritura: { completed: 8, totalTime: 280, averageScore: 74 },
                descomposicion: { completed: 8, totalTime: 240, averageScore: 80 },
                escala: { completed: 6, totalTime: 180, averageScore: 72 }
              }
            },
            {
              id: "student_3",
              name: "María Rodríguez", 
              email: "maria.rodriguez@student.edu",
              enrollmentDate: "2024-01-20",
              totalGamesPlayed: 28,
              averageScore: 94,
              lastActivity: "2024-10-12T16:45:00Z",
              progressByGame: {
                ordenamiento: { completed: 8, totalTime: 200, averageScore: 96 },
                escritura: { completed: 7, totalTime: 175, averageScore: 93 },
                descomposicion: { completed: 7, totalTime: 210, averageScore: 95 },
                escala: { completed: 6, totalTime: 150, averageScore: 92 }
              }
            },
            {
              id: "student_4",
              name: "Diego Martínez",
              email: "diego.martinez@student.edu", 
              enrollmentDate: "2024-02-01",
              totalGamesPlayed: 18,
              averageScore: 82,
              lastActivity: "2024-10-10T11:15:00Z",
              progressByGame: {
                ordenamiento: { completed: 6, totalTime: 180, averageScore: 84 },
                escritura: { completed: 4, totalTime: 120, averageScore: 79 },
                descomposicion: { completed: 5, totalTime: 150, averageScore: 85 },
                escala: { completed: 3, totalTime: 90, averageScore: 80 }
              }
            },
            {
              id: "student_5",
              name: "Sofia Hernández",
              email: "sofia.hernandez@student.edu",
              enrollmentDate: "2024-01-18", 
              totalGamesPlayed: 52,
              averageScore: 79,
              lastActivity: "2024-10-12T09:30:00Z",
              progressByGame: {
                ordenamiento: { completed: 18, totalTime: 540, averageScore: 81 },
                escritura: { completed: 14, totalTime: 420, averageScore: 77 },
                descomposicion: { completed: 12, totalTime: 360, averageScore: 82 },
                escala: { completed: 8, totalTime: 240, averageScore: 76 }
              }
            }
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading students:', error);
        setError('Error al cargar la lista de estudiantes');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchStudents();
    }
  }, [courseId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const getDaysSinceLastActivity = (dateString) => {
    const lastActivity = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - lastActivity);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (daysInactive) => {
    if (daysInactive <= 1) return 'active';
    if (daysInactive <= 3) return 'warning';
    return 'inactive';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'needs-improvement';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const daysInactive = getDaysSinceLastActivity(student.lastActivity);
    
    switch (filterBy) {
      case 'active':
        return daysInactive <= 2;
      case 'inactive':
        return daysInactive > 2;
      default:
        return true;
    }
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.averageScore - a.averageScore;
      case 'activity':
        return new Date(b.lastActivity) - new Date(a.lastActivity);
      case 'games':
        return b.totalGamesPlayed - a.totalGamesPlayed;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div className="student-list loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-list error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-list">
      <div className="list-header">
        <h2>👥 Lista de Estudiantes</h2>
        <p>Gestiona y revisa el progreso de tus estudiantes</p>
      </div>

      <div className="list-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar estudiante por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Ordenar por Nombre</option>
            <option value="score">Ordenar por Promedio</option>
            <option value="activity">Ordenar por Última Actividad</option>
            <option value="games">Ordenar por Juegos Jugados</option>
          </select>

          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los estudiantes</option>
            <option value="active">Activos (últimos 2 días)</option>
            <option value="inactive">Inactivos (+2 días)</option>
          </select>
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-value">{students.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {students.filter(s => getDaysSinceLastActivity(s.lastActivity) <= 2).length}
          </span>
          <span className="stat-label">Activos</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length)}%
          </span>
          <span className="stat-label">Promedio</span>
        </div>
      </div>

      <div className="students-grid">
        {sortedStudents.length === 0 ? (
          <div className="no-students">
            <p>No se encontraron estudiantes con los filtros aplicados</p>
          </div>
        ) : (
          sortedStudents.map((student) => {
            const daysInactive = getDaysSinceLastActivity(student.lastActivity);
            const statusColor = getStatusColor(daysInactive);
            const scoreColor = getScoreColor(student.averageScore);

            return (
              <div 
                key={student.id} 
                className="student-card"
                onClick={() => onSelectStudent && onSelectStudent(student)}
              >
                <div className="student-header">
                  <div className="student-avatar">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="student-info">
                    <h3 className="student-name">{student.name}</h3>
                    <p className="student-email">{student.email}</p>
                    <p className="enrollment-date">
                      Inscrito: {formatDate(student.enrollmentDate)}
                    </p>
                  </div>
                  <div className={`status-indicator ${statusColor}`}>
                    {daysInactive === 0 ? 'Hoy' : 
                     daysInactive === 1 ? 'Ayer' : 
                     `${daysInactive}d`}
                  </div>
                </div>

                <div className="student-stats">
                  <div className="stat-group">
                    <div className="stat">
                      <span className="stat-label">Juegos</span>
                      <span className="stat-value">{student.totalGamesPlayed}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Promedio</span>
                      <span className={`stat-value score-${scoreColor}`}>
                        {student.averageScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="games-progress">
                  {Object.entries(student.progressByGame).map(([game, progress]) => {
                    const gameNames = {
                      ordenamiento: 'Ordenamiento',
                      escritura: 'Escritura',
                      descomposicion: 'Descomposición', 
                      escala: 'Escala'
                    };

                    return (
                      <div key={game} className="game-progress">
                        <div className="game-progress-header">
                          <span className="game-name">{gameNames[game]}</span>
                          <span className="game-score">{progress.averageScore}%</span>
                        </div>
                        <div className="game-progress-bar">
                          <div 
                            className={`progress-fill ${game}`}
                            style={{ width: `${Math.min(progress.averageScore, 100)}%` }}
                          ></div>
                        </div>
                        <div className="game-details">
                          <span>{progress.completed} completados</span>
                          <span>{Math.round(progress.totalTime / 60)}min total</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="student-actions">
                  <button className="action-btn view-profile">
                    👤 Ver Perfil
                  </button>
                  <button className="action-btn send-message">
                    💬 Mensaje
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentList;