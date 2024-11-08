// moovieDB/services/tmdbService.js

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// Fonction pour créer un jeton de requête
export const createRequestToken = async () => {
  try {
      const response = await axios.get(`${BASE_URL}/authentication/token/new?api_key=${API_KEY}`);
      return response.data;
  } catch (error) {
      console.error('Erreur lors de la création du jeton de requête:', error.message);
      throw error;
  }
};

// Fonction pour créer une session
export const createSession = async (requestToken) => {
  try {
      const response = await axios.post(`${BASE_URL}/authentication/session/new?api_key=${API_KEY}`, {
          request_token: requestToken,
      });
      return response.data; 
  } catch (error) {
      console.error('Erreur lors de la création de la session:', error.response ? error.response.data : error.message);
      throw error;
  }
};

// Fonction pour supprimer une session
export const deleteSession = async (sessionId) => {
  try {
      const response = await axios.delete(`${BASE_URL}/authentication/session?api_key=${API_KEY}`, {
          data: { session_id: sessionId },
      });
      return response.data; 
  } catch (error) {
      console.error('Erreur lors de la suppression de la session:', error.message);
      throw error;
  }
};

export const getPopularMovies = async () => {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
  return response.data.results; // Retourne la liste des films populaires
};

// Récupérer les détails d'un film
export const getMovieById = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  return {
      id: response.data.id,
      title: response.data.title,
      description: response.data.overview,
      coverImage: `https://image.tmdb.org/t/p/w500${response.data.poster_path}`,
      releaseDate: response.data.release_date,
      genre: response.data.genres.map((genre) => genre.name)
  };
};

export const searchMovies = async (query) => {
  const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
  return response.data.results; 
};

export const addToWatchlist = async (listId, movieId, sessionId) => {
  try {
      const response = await axios.post(`https://api.themoviedb.org/3/list/${listId}/add_item?api_key=${API_KEY}&session_id=${sessionId}`, {
          media_id: movieId
      });
      return response.data;
  } catch (error) {
      console.error('Erreur lors de l\'ajout à la watchlist:', error.message);
      throw error;
  }
};


export const rateMovie = async (movieId, rating, sessionId) => {
  const response = await axios.post(`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${API_KEY}&session_id=${sessionId}`, {
      value: rating
  });
  return response.data; 
};

export const getSimilarMovies = async (movieId) => {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`);
  return response.data.results; 
};

export const getGenres = async () => {
  const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  return response.data.genres;
};

export const getPopularAnimes = async () => {
  const response = await axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`);
  return response.data.results;
};

// Fonction pour obtenir les animes similaires
export const getSimilarAnimes = async (animeId) => {
  const response = await axios.get(`https://api.themoviedb.org/3/tv/${animeId}/similar?api_key=${API_KEY}&language=en-US`);
  return response.data.results;
};

// Fonction pour chercher des animes par nom
export const searchAnimes = async (query) => {
  const response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`);
  return response.data.results; 
};

// Fonction pour noter un anime
export const rateAnime = async (animeId, rating, sessionId) => {
  const response = await axios.post(`https://api.themoviedb.org/3/tv/${animeId}/rating?api_key=${API_KEY}&session_id=${sessionId}`, {
      value: rating
  });
  return response.data; 
};

// Fonction pour ajouter un anime à la watchlist
export const addAnimeToWatchlist = async (sessionId, animeId, accountId) => {
  try {
      const response = await axios.post(`${BASE_URL}/account/${accountId}/watchlist`, {
          media_type: 'anime', 
          media_id: animeId,
          watchlist: true
      }, {
          params: {
              api_key: API_KEY,
              session_id: sessionId
          }
      });
      return response.data;
  } catch (error) {
      throw error;
  }
};


// Fonction pour obtenir les séries TV similaires
export const getSimilarTvShows = async (tvShowId) => {
  const response = await axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}/similar?api_key=${API_KEY}&language=en-US`);
  return response.data.results; 
};

// Fonction pour obtenir les séries TV populaires
export const getPopularTvShows = async () => {
  const response = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`);
  return response.data.results; 
};

// Fonction pour chercher des séries par nom
export const searchTvShows = async (query) => {
  const response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`);
  return response.data.results;
};

// Fonction pour ajouter à la watchlist
export const addToTvShowWatchlist = async (listId, mediaId, sessionId) => {
  const response = await axios.post(`https://api.themoviedb.org/3/list/${listId}/add_item?api_key=${API_KEY}&session_id=${sessionId}`, {
      media_id: mediaId
  });
  return response.data; 
};

// Fonction pour noter une série
export const rateTvShow = async (tvShowId, rating, sessionId) => {
  const response = await axios.post(`https://api.themoviedb.org/3/tv/${tvShowId}/rating?api_key=${API_KEY}&session_id=${sessionId}`, {
      value: rating
  });
  return response.data;
};

export const getTVShowById = async (tvShowId) => {
  const response = await axios.get(`${BASE_URL}/tv/${tvShowId}?api_key=${API_KEY}`);
  const tvShowData = response.data
  return {
    id: tvShowData.id,
    title: tvShowData.name,
    description: tvShowData.overview,
    coverImage: `https://image.tmdb.org/t/p/w500${tvShowData.poster_path}`,
    backdropImage: `https://image.tmdb.org/t/p/w500${tvShowData.backdrop_path}`,
    releaseDate: tvShowData.first_air_date,
    genre: tvShowData.genres.map((genre) => genre.name),
    seasons: tvShowData.seasons.map((season) => ({
      seasonNumber: season.season_number,
      episodeCount: season.episode_count,
      airDate: season.air_date,
      posterPath: `https://image.tmdb.org/t/p/w500${season.poster_path}`,
      name: season.name,
      overview: season.overview
    }))
  };
};

// Récupérer les détails d'un anime (si géré comme une série TV)
export const getAnimeById = async (animeId) => {
  return getTVShowById(animeId);
};

export const getMediaById = async (mediaId) => {
  try {
      const response = await axios.get(`${BASE_URL}/media/${mediaId}?api_key=${API_KEY}`);
      const mediaData = response.data;
      return {
          id: mediaData.id,
          title: mediaData.title || mediaData.name, // titre pour les films et nom pour les séries
          description: mediaData.overview,
          coverImage: `https://image.tmdb.org/t/p/w500${mediaData.poster_path}`,
          releaseDate: mediaData.release_date || mediaData.first_air_date,
          genre: mediaData.genres.map((genre) => genre.name)
      };
  } catch (error) {
      console.error('Erreur lors de la récupération des détails du média:', error.message);
      throw error;
  }
}; 


export const getRandomItemFromTMDB = async (category) => {
  try {
    // Récupérer une page aléatoire
    const randomPage = Math.floor(Math.random() * 20) + 1;  // Limité ici à 20 pages
    const response = await axios.get(`${BASE_URL}/discover/${category}`, {
      params: {
        api_key: API_KEY,
        page: randomPage,
        language: 'fr-FR',  // Langue de l'interface
      },
    });

    // Choisir un élément aléatoire parmi les résultats
    const randomIndex = Math.floor(Math.random() * response.data.results.length);
    const item = response.data.results[randomIndex];

    // Retourner les informations importantes de l'élément
    return {
      title: item.title || item.name,  // Le titre
      overview: item.overview,  // La description
      image: `https://image.tmdb.org/t/p/w500${item.poster_path}`,  // L'image
      background: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,  // Couverture de fond
    };
  } catch (error) {
    console.error('Erreur TMDb:', error);
    throw new Error('Impossible de récupérer les données de TMDb');
  }
};