import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { HiX, HiHeart } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { watchlistService } from '@/services/watchlistService';
import type { FavoriteItem } from '@/types/user';
import { Loader } from '@/common';
import { cn } from '@/utils/helper';
import { IMG_URL } from '@/utils/config';
import { useLanguage } from '@/context/languageContext';

const Favorites = () => {
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await watchlistService.getFavorites();
        setFavorites(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (titleId: string) => {
    try {
      await watchlistService.removeFromFavorites(titleId);
      setFavorites(prev => prev.filter(item => item.titleId !== titleId));
    } catch (err: any) {
      console.error('Failed to remove from favorites:', err);
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
            <HiHeart className="text-red-500 text-3xl" />
            <h1 className="text-4xl font-bold text-white">{t.favorites.title}</h1>
          </div>
          <p className="text-gray-400 text-sm">
            {t.favorites.itemCount(favorites.length)}
          </p>
        </m.div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 && !error && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <HiHeart className="text-gray-600 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t.favorites.empty}</h2>
            <p className="text-gray-400 text-sm mb-8 text-center max-w-md">
              {t.favorites.emptyMessage}
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-100 transition-all"
            >
              {t.common.browseContent}
            </button>
          </m.div>
        )}

        {/* Favorites Grid */}
        {favorites.length > 0 && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            {favorites.map((item, index) => (
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
                  aria-label="Remove from favorites"
                >
                  <HiX className="text-white text-lg" />
                </button>

                {/* Favorite Indicator */}
                <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur-md p-2 rounded-full">
                  <HiHeart className="text-red-500 text-lg" />
                </div>

                {/* Title Card */}
                <div
                  onClick={() => navigate(`/${item.title.type}/${item.title.tmdbId}`)}
                  className="cursor-pointer"
                >
                  <div className="aspect-[2/3] bg-white/5 rounded-lg overflow-hidden border border-white/10 group-hover:border-red-500/30 transition-all duration-200">
                    {item.title.poster ? (
                      <img
                        src={`${IMG_URL}/w342${item.title.poster}`}
                        alt={item.title.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <HiHeart className="text-gray-600 text-4xl" />
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-red-400 transition-colors">
                      {item.title.title}
                    </h3>
                    {item.title.releaseDate && (
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(item.title.releaseDate).getFullYear()}
                      </p>
                    )}
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

export default Favorites;
