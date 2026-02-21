import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { HiSparkles, HiFire, HiStar } from 'react-icons/hi';
import { recommendationService } from '@/services/recommendationService';
import type { Recommendation } from '@/types/user';
import { Loader } from '@/common';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const [personalizedRecs, setPersonalizedRecs] = useState<Recommendation[]>([]);
  const [trendingRecs, setTrendingRecs] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'personalized' | 'trending'>('personalized');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const [personalized, trending] = await Promise.all([
          recommendationService.getPersonalizedRecommendations(20),
          recommendationService.getTrending(20),
        ]);
        setPersonalizedRecs(personalized);
        setTrendingRecs(trending);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const displayRecs = activeTab === 'personalized' ? personalizedRecs : trendingRecs;

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
            <HiSparkles className="text-accent-cyan text-3xl" />
            <h1 className="text-4xl font-bold text-white">Recommendations</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Discover content curated just for you
          </p>
        </m.div>

        {/* Tab Navigation */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-3 mb-8"
        >
          <button
            onClick={() => setActiveTab('personalized')}
            className={`
              px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2
              ${activeTab === 'personalized'
                ? 'bg-white text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            <HiStar size={18} />
            For You
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`
              px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2
              ${activeTab === 'trending'
                ? 'bg-white text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            <HiFire size={18} />
            Trending
          </button>
        </m.div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {displayRecs.length === 0 && !error && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <HiSparkles className="text-gray-600 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No recommendations yet</h2>
            <p className="text-gray-400 text-sm mb-8 text-center max-w-md">
              Start watching content to get personalized recommendations based on your taste.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-100 transition-all"
            >
              Explore Content
            </button>
          </m.div>
        )}

        {/* Recommendations Grid */}
        {displayRecs.length > 0 && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            {displayRecs.map((item, index) => (
              <m.div
                key={`${item.titleId}-${item.titleType}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative group cursor-pointer"
                onClick={() => navigate(`/${item.titleType}/${item.titleId}`)}
              >
                {/* Score Badge */}
                {item.score && (
                  <div className="absolute top-2 right-2 z-10 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg">
                    <span className="text-accent-cyan font-semibold text-xs">
                      {Math.round(item.score * 100)}%
                    </span>
                  </div>
                )}

                <div className="aspect-[2/3] bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:scale-105">
                  {/* Placeholder - Replace with actual movie data */}
                  <div className="w-full h-full flex items-center justify-center">
                    <HiSparkles className="text-gray-600 text-4xl" />
                  </div>
                </div>

                {/* Reason Badge (if available) */}
                {item.reason && (
                  <div className="mt-2 text-xs text-gray-400 truncate">
                    {item.reason}
                  </div>
                )}
              </m.div>
            ))}
          </m.div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
