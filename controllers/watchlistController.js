// controllers/watchlistController.js
import Watchlist from '../models/Watchlist.js';
import { getMediaById } from '../services/tmdbService.js';

export const createWatchlistController = async (req, res) => {
    const { userId, title } = req.body; // Récupère les données du corps de la requête

    try {
        // Logique pour créer une entrée dans la watchlist
        const watchlistEntry = await Watchlist.create({ userId, title }); // Assurez-vous que tu as un modèle Watchlist

        res.status(201).json({
            success: true,
            data: watchlistEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la watchlist',
            error: error.message
        });
    }
};



// Contrôleur pour ajouter un média complet à la watchlist
export const addToWatchlistController = async (req, res) => {
    const { listId, mediaId } = req.body;

    try {
        const watchlist = await Watchlist.findById(listId);
        if (!watchlist) {
            return res.status(404).json({ success: false, message: 'Watchlist non trouvée' });
        }

        // Récupérer les détails complets du média depuis votre API
        const mediaDetails = await getMediaById(mediaId);
        if (!mediaDetails) {
            return res.status(404).json({ success: false, message: 'Média non trouvé' });
        }

        // Ajouter les détails du média à la watchlist
        watchlist.items.push({
            mediaId: mediaDetails.id,
            title: mediaDetails.title,
            description: mediaDetails.description,
            coverImage: mediaDetails.coverImage,
            releaseDate: mediaDetails.releaseDate,
            genre: mediaDetails.genre
            // Ajoutez d'autres champs si nécessaires
        });

        await watchlist.save();

        res.status(200).json({ success: true, message: 'Média ajouté à la watchlist', data: watchlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout à la watchlist', error: error.message });
    }
};


// Récupérer la watchlist d'un utilisateur
export const getUserWatchlistController = async (req, res) => {
    const { userId } = req.params;
    try {
        const watchlists = await Watchlist.find({ userId }).populate('items'); // Récupérer toutes les watchlists de l'utilisateur avec les médias peuplés
        if (!watchlists || watchlists.length === 0) {
            return res.status(404).json({ success: false, message: 'Aucune watchlist trouvée pour cet utilisateur.' });
        }
        res.status(200).json({ success: true, data: watchlists });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la watchlist', error: error.message });
    }
};


