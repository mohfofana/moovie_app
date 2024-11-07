import express from 'express';
import {
    fetchPopularTvShows,
    fetchTvShowsBySearch,
    fetchSimilarTvShows,
    addTvShowToWatchlist,
    rateTvShowController,
    getTVShowController
} from '../controllers/tvShowController.js';

const router = express.Router();

// Route pour récupérer les séries TV populaires
router.get('/popular', fetchPopularTvShows);

// Route pour rechercher des séries TV
router.get('/search', fetchTvShowsBySearch);

// Route pour obtenir des séries TV similaires
router.get('/similar/:tvShowId', fetchSimilarTvShows);

// Route pour ajouter une série à la watchlist
router.post('/watchlist', addTvShowToWatchlist);

router.get('/tv/:tvShowId', getTVShowController);

// Route pour noter une série
router.post('/rate', rateTvShowController);

export default router;
