import express, { Router } from 'express';
import { gameController } from '../controllers/gameController';

const router: Router = express.Router();

router.get('/:gameId/levels', gameController.getGameLevels);
router.get('/:gameId/levels/:level', gameController.getGameLevel);

export default router;

