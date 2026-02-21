import apiClient from '@/config/api';
import type { Recommendation } from '@/types/user';

export const recommendationService = {
  /**
   * Get personalized recommendations based on user activity
   */
  async getPersonalizedRecommendations(limit: number = 20): Promise<Recommendation[]> {
    const { data } = await apiClient.get<Recommendation[]>('/recommendations');
    return data;
  },

  /**
   * Get trending titles (uses /titles/trending endpoint)
   */
  async getTrending(limit: number = 20): Promise<any[]> {
    const { data } = await apiClient.get<any[]>('/titles/trending');
    return data;
  },

  /**
   * Search titles
   */
  async searchTitles(query: string, limit: number = 20): Promise<any[]> {
    const { data } = await apiClient.get<any[]>('/titles/search', {
      params: { query, limit },
    });
    return data;
  },
};
