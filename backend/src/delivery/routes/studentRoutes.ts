import express, { Router } from 'express';
import { studentController } from '../controllers/studentController';
import { protectAdminRoute } from '../middleware/authMiddleWare';

const router: Router = express.Router();

router.post('/student', protectAdminRoute(), studentController.addStudent);

export default router;
