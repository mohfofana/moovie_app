import { getRandomItemFromTMDB } from '../services/tmdbService.js';

export const getRandomContent = async (req, res) => {
    const type = req.query.type || 'movie';  // Type par défaut : 'movie'
  
    // Validation du type
    if (type !== 'movie' && type !== 'tv' && type !== 'anime') {
      return res.status(400).json({ error: 'Type invalide, utilisez "movie", "tv", ou "anime"' });
    }
  
    try {
      // Pour l'instant, on traite les animes comme des séries (tv)
      let category = type === 'anime' ? 'tv' : type;
      const item = await getRandomItemFromTMDB(category);
  
      // Retourner les informations importantes
      res.json({
        title: item.title,
        overview: item.overview,
        image: item.image,
        background: item.background,
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  };