import apiClient from '@/config/api';
import type { WatchlistItem, FavoriteItem } from '@/types/user';

export const watchlistService = {
  /**
   * Get user's watchlist
   */
  async getWatchlist(): Promise<WatchlistItem[]> {
    const { data } = await apiClient.get<WatchlistItem[]>('/watchlist');
    return data;
  },

  /**
   * Add title to watchlist
   */
  async addToWatchlist(titleId: number, titleType: 'movie' | 'tv'): Promise<WatchlistItem> {
    const { data } = await apiClient.post<WatchlistItem>('/watchlist', {
      titleId,
      titleType,
    });
    return data;
  },

  /**
   * Remove title from watchlist
   */
  async removeFromWatchlist(id: string): Promise<void> {
    await apiClient.delete(`/watchlist/${id}`);
  },

  /**
   * Check if title is in watchlist
   */
  async isInWatchlist(titleId: number): Promise<boolean> {
    const { data } = await apiClient.get<{ inWatchlist: boolean }>(`/watchlist/check/${titleId}`);
    return data.inWatchlist;
  },

  /**
   * Get user's favorites
   */
  async getFavorites(): Promise<FavoriteItem[]> {
    const { data } = await apiClient.get<FavoriteItem[]>('/favorites');
    return data;
  },

  /**
   * Add title to favorites
   */
  async addToFavorites(titleId: number, titleType: 'movie' | 'tv'): Promise<FavoriteItem> {
    const { data} = await apiClient.post<FavoriteItem>('/favorites', {
      titleId,
      titleType,
    });
    return data;
  },

  /**
   * Remove title from favorites
   */
  async removeFromFavorites(id: string): Promise<void> {
    await apiClient.delete(`/favorites/${id}`);
  },

  /**
   * Check if title is favorited
   */
  async isFavorited(titleId: number): Promise<boolean> {
    const { data } = await apiClient.get<{ isFavorited: boolean }>(`/favorites/check/${titleId}`);
    return data.isFavorited;
  },
};
