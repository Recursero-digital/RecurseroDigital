import express, { Router } from 'express';
import { logoutController } from '../controllers/logoutController';

const router: Router = express.Router();

router.post('/logout', logoutController.logout);


export default router;

