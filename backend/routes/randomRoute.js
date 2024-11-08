import express from 'express';
import { getRandomContent } from '../controllers/randomController.js';

const router = express.Router();

// Route pour obtenir un film, une série ou un anime aléatoire
router.get('/random', getRandomContent);

export default router;