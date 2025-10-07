import express, { Router } from 'express';
import { studentController } from '../controllers/studentController';

const router: Router = express.Router();

router.post('/student', studentController.addStudent);

export default router;
