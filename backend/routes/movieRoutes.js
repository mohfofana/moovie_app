import express from 'express';
import {
    getPopularMoviesController,
    searchMoviesController,
    addMovieToWatchlistController,
    rateMovieController,
    getSimilarMoviesController,
    getGenresController,
    getMovieController
} from '../controllers/movieController.js';

const router = express.Router();

router.get('/popular', getPopularMoviesController);
router.get('/movie/:movieId', getMovieController);
router.get('/search', searchMoviesController);
router.post('/watchlist', addMovieToWatchlistController);
router.post('/rate', rateMovieController);
router.get('/similar/:movieId', getSimilarMoviesController);
router.get('/genres', getGenresController);

export default router;
