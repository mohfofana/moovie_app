import apiClient from '@/config/api';
import type { WatchHistory } from '@/types/user';

export const historyService = {
  /**
   * Get user's watch history (continue watching)
   */
  async getHistory(limit?: number): Promise<WatchHistory[]> {
    const { data } = await apiClient.get<WatchHistory[]>('/watch/continue', {
      params: { limit },
    });
    return data;
  },

  /**
   * Add or update watch progress
   */
  async updateProgress(
    titleId: number,
    titleType: 'movie' | 'tv',
    progress: number,
    completed: boolean = false
  ): Promise<WatchHistory> {
    const { data } = await apiClient.post<WatchHistory>('/watch/progress', {
      titleId,
      titleType,
      progress,
      completed,
    });
    return data;
  },

  /**
   * Mark title as viewed (interaction)
   */
  async markAsViewed(titleId: number, titleType: 'movie' | 'tv'): Promise<void> {
    await apiClient.post('/interactions', {
      titleId,
      titleType,
      viewed: true,
    });
  },

  /**
   * Mark title as watched (100% progress)
   */
  async markAsWatched(titleId: number, titleType: 'movie' | 'tv'): Promise<WatchHistory> {
    const { data } = await apiClient.post<WatchHistory>('/watch/progress', {
      titleId,
      titleType,
      progress: 100,
      completed: true,
    });
    return data;
  },

  /**
   * Like or dislike a title
   */
  async likeTitle(titleId: number, titleType: 'movie' | 'tv', liked: boolean): Promise<void> {
    await apiClient.post('/interactions', {
      titleId,
      titleType,
      liked,
    });
  },

  /**
   * Delete history entry (remove from continue watching)
   * Note: Backend may not have this endpoint
   */
  async deleteHistoryEntry(titleId: string): Promise<void> {
    // Since backend doesn't have a delete endpoint for history,
    // we can mark it as completed to remove from continue watching
    await apiClient.post('/watch/progress', {
      titleId: parseInt(titleId),
      titleType: 'movie', // Default, might need to be passed as parameter
      progress: 100,
      completed: true,
    });
  },

  /**
   * Clear all history
   * Note: Backend may not have this endpoint
   */
  async clearHistory(): Promise<void> {
    // This might not be supported by the backend
    // You may need to implement this in the backend
    throw new Error('Clear history not yet implemented in backend');
  },
};
