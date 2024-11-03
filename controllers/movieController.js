import {
  getPopularMovies,
  searchMovies,
  addToWatchlist,
  rateMovie,
  getSimilarMovies,
  getGenres,
  getMovieById
} from '../services/tmdbService.js';

export const getPopularMoviesController = async (req, res) => {
  try {
      const movies = await getPopularMovies();
      res.json(movies);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getMovieController = async (req, res) => {
  const { movieId } = req.params;
  try {
      const movie = await getMovieById(movieId);
      res.status(200).json({ success: true, data: movie });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur lors de la récupération du film', error: error.message });
  }
};

export const searchMoviesController = async (req, res) => {
  const { query } = req.query;
  try {
      const results = await searchMovies(query);
      res.json(results);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const addMovieToWatchlistController = async (req, res) => {
  const { listId, movieId, sessionId } = req.body; // Vérifiez si req.body contient bien ces paramètres
  try {
      const response = await addToWatchlist(listId, movieId, sessionId);
      res.json(response);
  } catch (error) {
      console.error('Erreur dans le contrôleur lors de l\'ajout à la watchlist:', error.message);
      res.status(500).json({ message: error.message });
  }
};

export const rateMovieController = async (req, res) => {
  const { movieId, rating, sessionId } = req.body;
  try {
      const response = await rateMovie(movieId, rating, sessionId);
      res.json(response);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getSimilarMoviesController = async (req, res) => {
  const { movieId } = req.params;
  try {
      const similarMovies = await getSimilarMovies(movieId);
      res.json(similarMovies);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getGenresController = async (req, res) => {
  try {
      const genres = await getGenres();
      res.json(genres);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
