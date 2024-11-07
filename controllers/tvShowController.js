import { 
  getPopularTvShows, 
  searchTvShows, 
  getSimilarTvShows, 
  addToTvShowWatchlist, 
  rateTvShow,
  getTVShowById
} from '../services/tmdbService.js';

// Contrôleur pour récupérer les séries TV populaires
export const fetchPopularTvShows = async (req, res) => {
  try {
      const tvShows = await getPopularTvShows();
      res.status(200).json({ success: true, tvShows });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Erreur lors de la récupération des séries populaires',
          error: error.message,
      });
  }
};

export const getTVShowController = async (req, res) => {
    const { tvShowId } = req.params;
    try {
        const tvShow = await getTVShowById(tvShowId);
        res.status(200).json({ success: true, data: tvShow });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la série TV', error: error.message });
    }
};

// Contrôleur pour chercher des séries TV par nom
export const fetchTvShowsBySearch = async (req, res) => {
  const { query } = req.query; // Supposons que la recherche soit passée en tant que paramètre de requête
  try {
      const tvShows = await searchTvShows(query);
      res.status(200).json({ success: true, tvShows });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Erreur lors de la recherche de séries',
          error: error.message,
      });
  }
};

// Contrôleur pour obtenir des séries TV similaires
export const fetchSimilarTvShows = async (req, res) => {
  const { tvShowId } = req.params; // Supposons que l'ID de la série soit passé en tant que paramètre d'URL
  try {
      const similarTvShows = await getSimilarTvShows(tvShowId);
      res.status(200).json({ success: true, similarTvShows });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Erreur lors de la récupération des séries similaires',
          error: error.message,
      });
  }
};

// Contrôleur pour ajouter une série à la watchlist
export const addTvShowToWatchlist = async (req, res) => {
  const { listId, mediaId, sessionId } = req.body; // Supposons que ces données soient envoyées dans le corps de la requête
  try {
      const result = await addToTvShowWatchlist(listId, mediaId, sessionId);
      res.status(200).json({ success: true, result });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'ajout à la watchlist',
          error: error.message,
      });
  }
};

// Contrôleur pour noter une série
export const rateTvShowController = async (req, res) => {
  const { tvShowId, rating, sessionId } = req.body; // Supposons que ces données soient envoyées dans le corps de la requête
  try {
      const result = await rateTvShow(tvShowId, rating, sessionId);
      res.status(200).json({ success: true, result });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Erreur lors de la notation de la série',
          error: error.message,
      });
  }
};

// N'oublie pas d'ajouter d'autres contrôleurs si nécessaire
