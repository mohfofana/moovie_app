export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  favoriteGenres: number[];
  language: string;
  notifications: boolean;
  autoplay: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  profileName?: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  titleId: number;
  titleType: 'movie' | 'tv';
  addedAt: string;
  title?: {
    id: number;
    title: string;
    posterPath: string;
    releaseDate?: string;
    voteAverage?: number;
  };
}

export interface FavoriteItem extends WatchlistItem {
  favoritedAt: string;
}

export interface WatchHistory {
  id: string;
  userId: string;
  titleId: number;
  titleType: 'movie' | 'tv';
  watchedAt: string;
  progress: number; // 0-100
  completed: boolean;
  rating?: number; // 1-5 stars
}

export interface Recommendation {
  titleId: number;
  titleType: 'movie' | 'tv';
  score: number;
  reason: string;
  title: {
    id: number;
    title: string;
    overview: string;
    posterPath: string;
    backdropPath: string;
    voteAverage: number;
    releaseDate: string;
  };
}
