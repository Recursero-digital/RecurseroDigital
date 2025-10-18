import express, { Router } from 'express';
import { teacherController } from '../controllers/TeacherController';
import { protectAdminRoute, protectTeacherOrAdminRoute } from '../middleware/authMiddleWare';

const router: Router = express.Router();

router.post('/:teacherId/courses', protectAdminRoute(), teacherController.assignTeacherToCourses);
router.get('/courses', protectTeacherOrAdminRoute(), teacherController.getTeacherCourses);

export default router;