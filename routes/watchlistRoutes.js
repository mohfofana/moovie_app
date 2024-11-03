import express from 'express';
import { createWatchlistController, addToWatchlistController, getUserWatchlistController} from '../controllers/watchlistController.js';

const router = express.Router();

// Route pour créer une nouvelle watchlist
router.post('/watchlist', createWatchlistController);
// Route pour ajouter un média à la watchlist
router.post('/add', addToWatchlistController);

// Route pour obtenir toutes les watchlists d’un utilisateur
router.get('/:userId', getUserWatchlistController);

export default router;