import apiClient from '@/config/api';

export interface TitleDetails {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  popularity: number;
  genres: Array<{ id: number; name: string }>;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }>;
  };
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      type: string;
    }>;
  };
  seasons?: SeasonSummary[];
  number_of_seasons?: number;
}

export interface SeasonSummary {
  id: number;
  season_number: number;
  name: string;
  overview?: string;
  poster_path?: string;
  episode_count?: number;
  air_date?: string;
}

export interface EpisodeDetails {
  id: number;
  episode_number: number;
  name: string;
  overview?: string;
  still_path?: string;
  air_date?: string;
  runtime?: number;
}

export interface SeasonDetails {
  id: number;
  name: string;
  season_number: number;
  overview?: string;
  poster_path?: string;
  episodes: EpisodeDetails[];
}

export interface TitleSearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: string;
}

export interface TitlesResponse {
  page: number;
  results: TitleSearchResult[];
  total_pages: number;
  total_results: number;
}

export const titlesService = {
  /**
   * Get trending titles (movies or TV shows)
   */
  async getTrending(type: 'movie' | 'tv' = 'movie'): Promise<TitlesResponse> {
    const { data } = await apiClient.get<TitlesResponse>('/titles/trending', {
      params: { type },
    });
    return data;
  },

  /**
   * Search for titles
   */
  async search(query: string, type?: 'movie' | 'tv'): Promise<TitlesResponse> {
    const { data } = await apiClient.get<TitlesResponse>('/titles/search', {
      params: { q: query, type },
    });
    return data;
  },

  /**
   * Get title details by TMDB ID
   */
  async getDetails(tmdbId: number, type: 'movie' | 'tv' = 'movie'): Promise<TitleDetails> {
    const { data } = await apiClient.get<TitleDetails>(`/titles/${tmdbId}`, {
      params: { type },
    });
    return data;
  },

  async getTvSeasons(tmdbId: number): Promise<SeasonSummary[]> {
    const { data } = await apiClient.get<SeasonSummary[]>(`/titles/${tmdbId}/seasons`);
    return data;
  },

  async getTvSeasonDetails(tmdbId: number, seasonNumber: number): Promise<SeasonDetails> {
    const { data } = await apiClient.get<SeasonDetails>(
      `/titles/${tmdbId}/seasons/${seasonNumber}`
    );
    return data;
  },
};
