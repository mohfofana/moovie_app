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
};
