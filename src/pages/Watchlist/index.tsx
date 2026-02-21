import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { HiX, HiBookmark } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { watchlistService } from '@/services/watchlistService';
import type { WatchlistItem } from '@/types/user';
import { MovieCard, Loader } from '@/common';
import { cn } from '@/utils/helper';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const data = await watchlistService.getWatchlist();
        setWatchlist(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load watchlist');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleRemove = async (titleId: number) => {
    try {
      await watchlistService.removeFromWatchlist(titleId.toString());
      setWatchlist(prev => prev.filter(item => item.titleId !== titleId));
    } catch (err: any) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <HiBookmark className="text-accent-cyan text-3xl" />
            <h1 className="text-4xl font-bold text-white">My Watchlist</h1>
          </div>
          <p className="text-gray-400 text-sm">
            {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved to watch later
          </p>
        </m.div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {watchlist.length === 0 && !error && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <HiBookmark className="text-gray-600 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your watchlist is empty</h2>
            <p className="text-gray-400 text-sm mb-8 text-center max-w-md">
              Start adding movies and TV shows you want to watch. They'll appear here.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-100 transition-all"
            >
              Browse Content
            </button>
          </m.div>
        )}

        {/* Watchlist Grid */}
        {watchlist.length > 0 && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            {watchlist.map((item, index) => (
              <m.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative group"
              >
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.titleId);
                  }}
                  className={cn(
                    'absolute top-2 right-2 z-10',
                    'bg-black/80 backdrop-blur-md p-2 rounded-full',
                    'opacity-0 group-hover:opacity-100',
                    'transition-opacity duration-200',
                    'hover:bg-red-500/80'
                  )}
                  aria-label="Remove from watchlist"
                >
                  <HiX className="text-white text-lg" />
                </button>

                {/* Note: MovieCard component would need to be updated to accept watchlist data */}
                <div
                  onClick={() => navigate(`/${item.titleType}/${item.titleId}`)}
                  className="cursor-pointer"
                >
                  <div className="aspect-[2/3] bg-white/5 rounded-lg overflow-hidden border border-white/10">
                    {/* Placeholder - Replace with actual movie data */}
                    <div className="w-full h-full flex items-center justify-center">
                      <HiBookmark className="text-gray-600 text-4xl" />
                    </div>
                  </div>
                </div>
              </m.div>
            ))}
          </m.div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
