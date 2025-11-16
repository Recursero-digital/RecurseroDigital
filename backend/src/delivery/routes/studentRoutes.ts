import express, { Router } from 'express';
import { studentController, studentExtendedController } from '../controllers/studentController';
import { protectAdminRoute, protectRoute } from '../middleware/authMiddleWare';
import { UserRole } from '../../core/models/User';

const router: Router = express.Router();

router.post('/', protectAdminRoute(), studentController.addStudent);
router.get('/', protectAdminRoute(), studentController.getAllStudents);

// /api/student/me/games
router.get('/me/games', protectRoute(UserRole.STUDENT), studentController.getMyGames);

// POST /api/student/:studentId/course
router.post('/:studentId/course', protectAdminRoute(), studentExtendedController.assignCourseToStudent);

export default router;
