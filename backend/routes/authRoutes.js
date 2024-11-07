// streaming-site/routes/authRoutes.js

import express from 'express';
import { authenticate, createSessionFromToken, deleteSessionController } from '../controllers/authController.js';

const router = express.Router();

router.get('/authenticate', authenticate);
router.post('/create-session', createSessionFromToken); 

// Route pour supprimer une session
router.delete('/session', deleteSessionController);

export default router;
