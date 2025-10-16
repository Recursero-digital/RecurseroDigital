import express, { Router } from 'express';
import { courseController } from '../controllers/courseController';
import { protectAdminRoute } from '../middleware/authMiddleWare';

const router: Router = express.Router();

router.post('/:courseId/game', protectAdminRoute(), courseController.addGameToCourse);
// POST /api/courses { name }
router.post('/', protectAdminRoute(), courseController.createCourse);

export default router;