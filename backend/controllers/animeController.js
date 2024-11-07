import { 
  getPopularAnimes, 
  searchAnimes, 
  getSimilarAnimes, 
  addAnimeToWatchlist, 
  rateAnime,
  getAnimeById 
} from '../services/tmdbService.js';

// Contrôleur pour récupérer les animes populaires
export const fetchPopularAnimes = async (req, res) => {
  try {
      const popularAnimes = await getPopularAnimes();
      res.status(200).json({ success: true, data: popularAnimes });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur lors de la récupération des animes populaires', error: error.message });
  }
};

export const getAnimeController = async (req, res) => {
  const { animeId } = req.params;
  try {
      const anime = await getAnimeById(animeId);
      res.status(200).json({ success: true, data: anime });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur lors de la récupération de l\'anime', error: error.message });
  }
};

// Contrôleur pour rechercher des animes
export const fetchAnimesBySearch = async (req, res) => {
  const { query } = req.query;
  try {
      const searchResults = await searchAnimes(query);
      res.status(200).json({ success: true, data: searchResults });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur lors de la recherche d\'animes', error: error.message });
  }
};

// Contrôleur pour obtenir des animes similaires
export const fetchSimilarAnimes = async (req, res) => {
  const { animeId } = req.params; // On suppose que l'ID de l'anime est passé dans les paramètres de l'URL
  try {
      const similarAnimes = await getSimilarAnimes(animeId);
      res.status(200).json({ success: true, data: similarAnimes });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur lors de la récupération des animes similaires', error: error.message });
  }
};

export const addAnimeToWatchlistController = async (req, res) => {
  const { sessionId, animeId, accountId } = req.body;

  try {
      const response = await addAnimeToWatchlist(sessionId, animeId, accountId);
      res.status(200).json({
          success: true,
          message: 'Anime ajouté à la watchlist',
          data: response,
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'ajout de l\'anime à la watchlist',
          error: error.response ? error.response.data : error.message,
      });
  }
};

// Contrôleur pour noter un anime
export const rateAnimeController = async (req, res) => {
  const { animeId, sessionId, rating } = req.body; // On suppose que l'ID de l'anime, la session ID et la note sont passés dans le corps de la requête
  try {
      const result = await rateAnime(animeId, sessionId, rating);
      res.status(200).json({ success: true, message: 'Anime noté avec succès', data: result });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur lors de la notation de l\'anime', error: error.message });
  }
};