import express, { Router } from 'express';
import { courseController } from '../controllers/courseController';
import { protectAdminRoute } from '../middleware/authMiddleWare';

const router: Router = express.Router();

router.post('/course/:courseId/game', protectAdminRoute(), courseController.addGameToCourse);

export default router;


