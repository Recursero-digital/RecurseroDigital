import express, { Router } from 'express';
import { courseController } from '../controllers/courseController';
import { protectAdminRoute } from '../middleware/authMiddleWare';

const router: Router = express.Router();

router.get('/', protectAdminRoute(), courseController.getAllCourses);
router.post('/:courseId/game', protectAdminRoute(), courseController.addGameToCourse);
router.get('/:courseId/students', courseController.getCourseStudents);
router.post('/', protectAdminRoute(), courseController.createCourse);
router.patch('/:courseId', protectAdminRoute(), courseController.updateCourse);
router.delete('/:courseId', protectAdminRoute(), courseController.deleteCourse);

export default router;