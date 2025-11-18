import express, { Router } from 'express';
import { studentController, studentExtendedController } from '../controllers/studentController';
import { protectAdminRoute, protectRoute } from '../middleware/authMiddleWare';
import { UserRole } from '../../core/models/User';

const router: Router = express.Router();

router.post('/', protectAdminRoute(), studentController.addStudent);
router.get('/', protectAdminRoute(), studentController.getAllStudents);

// /api/student/me/games
router.get('/me/games', protectRoute(UserRole.STUDENT), studentController.getMyGames);

// PATCH /api/student/:studentId
router.patch('/:studentId', protectAdminRoute(), studentController.updateStudent);

// DELETE /api/student/:studentId
router.delete('/:studentId', protectAdminRoute(), studentController.deleteStudent);

// POST /api/student/:studentId/courses
router.post('/:studentId/courses', protectAdminRoute(), studentExtendedController.assignCourseToStudent);

export default router;
