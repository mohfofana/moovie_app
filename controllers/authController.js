import { createRequestToken, createSession, deleteSession } from '../services/tmdbService.js';

// Contrôleur pour gérer l'authentification et la création de session
export const authenticate = async (req, res) => {
    try {
        // 1. Créer un jeton de requête
        const { request_token } = await createRequestToken();

        // 2. Rediriger l'utilisateur vers l'URL d'authentification
        const redirectUrl = `https://www.themoviedb.org/authenticate/${request_token}`;
        
        // Renvoie l'URL d'authentification
        res.status(200).json({ success: true, request_token, redirectUrl });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'authentification',
            error: error.message,
        });
    }
};

// Route pour créer une session après l'approbation de l'utilisateur
export const createSessionFromToken = async (req, res) => {
    const { request_token } = req.body; // Supposons que le request_token soit envoyé ici après que l'utilisateur ait été redirigé
    try {
        const sessionData = await createSession(request_token);
        res.status(200).json({
            success: true,
            sessionData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la session',
            error: error.response ? error.response.data : error.message,
        });
    }
};


// Contrôleur pour supprimer une session
export const deleteSessionController = async (req, res) => {
    const { sessionId } = req.body; // Assurez-vous que sessionId est envoyé dans le corps de la requête
    try {
        const response = await deleteSession(sessionId);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la session.' });
    }
};