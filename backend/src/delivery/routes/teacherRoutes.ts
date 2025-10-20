import express, { Router } from 'express';
import { teacherController } from '../controllers/TeacherController';
import { protectAdminRoute, protectTeacherRoute, protectTeacherOrAdminRoute } from '../middleware/authMiddleWare';

const router: Router = express.Router();

router.post('/:teacherId/courses', protectAdminRoute(), teacherController.assignTeacherToCourses);
router.get('/me/courses', protectTeacherOrAdminRoute(), teacherController.getTeacherCourses);
router.get('/me/course/:courseId', protectTeacherRoute(), teacherController.getMyCourseDetails);

export default router;