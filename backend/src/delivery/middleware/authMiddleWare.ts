import { Request, Response, NextFunction } from 'express';
import { DependencyContainer } from '../../config/DependencyContainer';
import { UserRole } from '../../core/models/User';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: UserRole;
    };
}

export const protectRoute = (...allowedRoles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Token no proporcionado' });
            return;
        }

        const token = authHeader.split(' ')[1];

        try {
            const tokenService = DependencyContainer.getInstance().tokenService;
            const decoded = tokenService.verify(token) as any;

            if (!decoded) {
                res.status(403).json({ error: 'Token inválido o expirado' });
                return;
            }

            if (!decoded.role) {
                res.status(403).json({ error: 'Token inválido: falta información de rol' });
                return;
            }

            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                res.status(403).json({ 
                    error: 'Acceso denegado: no tienes permisos para acceder a este recurso' 
                });
                return;
            }

            req.user = {
                id: decoded.id,
                username: decoded.username,
                role: decoded.role as UserRole
            };

            next();
        } catch (error) {
            res.status(403).json({ error: 'Token inválido o expirado' });
            return;
        }
    };
};

export const protectAdminRoute = () => protectRoute(UserRole.ADMIN);

export const protectTeacherRoute = () => protectRoute(UserRole.TEACHER);

export const protectStudentRoute = () => protectRoute(UserRole.STUDENT);

export const protectTeacherOrAdminRoute = () => protectRoute(UserRole.TEACHER, UserRole.ADMIN);

export const protectStudentOrTeacherRoute = () => protectRoute(UserRole.STUDENT, UserRole.TEACHER);

export const protectAuthenticatedRoute = () => protectRoute(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT);
