import apiClient from '@/config/api';
import type { Recommendation } from '@/types/user';

export const recommendationService = {
  /**
   * Get personalized recommendations based on user activity
   */
  async getPersonalizedRecommendations(limit: number = 20): Promise<Recommendation[]> {
    const { data } = await apiClient.get<Recommendation[]>('/recommendations', {
      params: { limit },
    });
    return data;
  },

  /**
   * Get recommendations for a specific title (similar titles)
   */
  async getSimilarTitles(titleId: number, titleType: 'movie' | 'tv', limit: number = 10): Promise<Recommendation[]> {
    const { data } = await apiClient.get<Recommendation[]>(`/recommendations/similar/${titleId}`, {
      params: { titleType, limit },
    });
    return data;
  },

  /**
   * Get trending recommendations
   */
  async getTrending(limit: number = 20): Promise<Recommendation[]> {
    const { data } = await apiClient.get<Recommendation[]>('/recommendations/trending', {
      params: { limit },
    });
    return data;
  },

  /**
   * Get recommendations by genre
   */
  async getByGenre(genreId: number, limit: number = 20): Promise<Recommendation[]> {
    const { data } = await apiClient.get<Recommendation[]>(`/recommendations/genre/${genreId}`, {
      params: { limit },
    });
    return data;
  },
};
