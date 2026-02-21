import apiClient from '@/config/api';
import type { WatchlistItem, FavoriteItem } from '@/types/user';

export const watchlistService = {
  /**
   * Get user's watchlist (my-list)
   */
  async getWatchlist(): Promise<WatchlistItem[]> {
    const { data } = await apiClient.get<WatchlistItem[]>('/my-list');
    return data;
  },

  /**
   * Add title to watchlist
   */
  async addToWatchlist(titleId: number, titleType: 'movie' | 'tv'): Promise<WatchlistItem> {
    const { data } = await apiClient.post<WatchlistItem>(`/my-list/${titleId}?type=${titleType}`);
    return data;
  },

  /**
   * Remove title from watchlist
   */
  async removeFromWatchlist(titleId: string): Promise<void> {
    await apiClient.delete(`/my-list/${titleId}`);
  },

  /**
   * Check if title is in watchlist
   */
  async isInWatchlist(titleId: number): Promise<boolean> {
    try {
      const watchlist = await this.getWatchlist();
      return watchlist.some(item => item.titleId === titleId);
    } catch {
      return false;
    }
  },

  /**
   * Get user's favorites (same as watchlist for now)
   */
  async getFavorites(): Promise<FavoriteItem[]> {
    const { data } = await apiClient.get<FavoriteItem[]>('/my-list');
    return data;
  },

  /**
   * Add title to favorites (same as watchlist)
   */
  async addToFavorites(titleId: number, titleType: 'movie' | 'tv'): Promise<FavoriteItem> {
    const { data } = await apiClient.post<FavoriteItem>(`/my-list/${titleId}?type=${titleType}`);
    return data;
  },

  /**
   * Remove title from favorites
   */
  async removeFromFavorites(titleId: string): Promise<void> {
    await apiClient.delete(`/my-list/${titleId}`);
  },

  /**
   * Check if title is favorited
   */
  async isFavorited(titleId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(item => item.titleId === titleId);
    } catch {
      return false;
    }
  },
};
