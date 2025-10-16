import express, { Router } from 'express';
import { teacherController } from '../controllers/TeacherController';
import { protectAdminRoute } from '../middleware/authMiddleWare';

const router: Router = express.Router();

router.post('/assign-courses', protectAdminRoute(), teacherController.assignTeacherToCourses);

export default router;