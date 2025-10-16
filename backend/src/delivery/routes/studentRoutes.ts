import express, { Router } from 'express';
import { studentController } from '../controllers/studentController';
import { protectAdminRoute, protectRoute } from '../middleware/authMiddleWare';
import { UserRole } from '../../core/models/User';

const router: Router = express.Router();

router.post('/student', protectAdminRoute(), studentController.addStudent);

// /api/student/me/games
router.get('/student/me/games', protectRoute(UserRole.STUDENT), studentController.getMyGames);

export default router;
