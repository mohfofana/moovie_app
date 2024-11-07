import express from 'express';
import {
    fetchPopularAnimes,
    fetchAnimesBySearch,
    fetchSimilarAnimes,
    addAnimeToWatchlistController,
    rateAnimeController,
    getAnimeController
} from '../controllers/animeController.js';

const router = express.Router();

// Route pour récupérer les animes populaires
router.get('/popular', fetchPopularAnimes);

// Route pour rechercher des animes par nom
router.get('/search', fetchAnimesBySearch);

// Route pour obtenir des animes similaires
router.get('/similar/:animeId', fetchSimilarAnimes);

router.get('/anime/:animeId', getAnimeController);

// Route pour ajouter un anime à la watchlist
router.post('/watchlist', addAnimeToWatchlistController);

// Route pour noter un anime
router.post('/rate', rateAnimeController);

export default router;
