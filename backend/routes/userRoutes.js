// streaming-site/routes/userRoutes.js

import express from 'express';
import { registerUserController, getAllUsersController } from '../controllers/userController.js';

const router = express.Router();

// Route pour s'inscrire
router.post('/register', registerUserController);

// Route pour obtenir tous les utilisateurs
router.get('/', getAllUsersController);

export default router;
