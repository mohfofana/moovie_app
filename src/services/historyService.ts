import apiClient from '@/config/api';
import type { WatchHistory } from '@/types/user';

export const historyService = {
  /**
   * Get user's watch history
   */
  async getHistory(limit?: number): Promise<WatchHistory[]> {
    const { data } = await apiClient.get<WatchHistory[]>('/history', {
      params: { limit },
    });
    return data;
  },

  /**
   * Add or update watch history entry
   */
  async updateProgress(
    titleId: number,
    titleType: 'movie' | 'tv',
    progress: number,
    completed: boolean = false
  ): Promise<WatchHistory> {
    const { data } = await apiClient.post<WatchHistory>('/history', {
      titleId,
      titleType,
      progress,
      completed,
    });
    return data;
  },

  /**
   * Rate a watched title
   */
  async rateTitle(historyId: string, rating: number): Promise<WatchHistory> {
    const { data } = await apiClient.patch<WatchHistory>(`/history/${historyId}/rate`, {
      rating,
    });
    return data;
  },

  /**
   * Mark title as watched
   */
  async markAsWatched(titleId: number, titleType: 'movie' | 'tv'): Promise<WatchHistory> {
    const { data } = await apiClient.post<WatchHistory>('/history/watched', {
      titleId,
      titleType,
      progress: 100,
      completed: true,
    });
    return data;
  },

  /**
   * Get progress for a specific title
   */
  async getProgress(titleId: number): Promise<number> {
    const { data } = await apiClient.get<{ progress: number }>(`/history/progress/${titleId}`);
    return data.progress;
  },

  /**
   * Delete history entry
   */
  async deleteHistoryEntry(id: string): Promise<void> {
    await apiClient.delete(`/history/${id}`);
  },

  /**
   * Clear all history
   */
  async clearHistory(): Promise<void> {
    await apiClient.delete('/history');
  },
};
