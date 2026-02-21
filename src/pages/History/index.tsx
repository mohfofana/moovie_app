import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { HiClock, HiX, HiCheck, HiStar } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { historyService } from '@/services/historyService';
import type { WatchHistory } from '@/types/user';
import { Loader } from '@/common';
import { cn } from '@/utils/helper';

const History = () => {
  const [history, setHistory] = useState<WatchHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await historyService.getHistory();
        setHistory(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load watch history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await historyService.deleteHistoryEntry(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      console.error('Failed to remove from history:', err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all watch history?')) return;

    try {
      await historyService.clearHistory();
      setHistory([]);
    } catch (err: any) {
      setError('Failed to clear history');
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <HiClock className="text-accent-cyan text-3xl" />
              <h1 className="text-4xl font-bold text-white">Watch History</h1>
            </div>
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            {history.length} {history.length === 1 ? 'item' : 'items'} in your watch history
          </p>
        </m.div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {history.length === 0 && !error && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <HiClock className="text-gray-600 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No watch history</h2>
            <p className="text-gray-400 text-sm mb-8 text-center max-w-md">
              Start watching movies and TV shows. Your watch history will appear here.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-100 transition-all"
            >
              Start Watching
            </button>
          </m.div>
        )}

        {/* History List */}
        {history.length > 0 && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {history.map((item, index) => (
              <m.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="dark-glass rounded-xl p-4 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail Placeholder */}
                  <div
                    onClick={() => navigate(`/${item.titleType}/${item.titleId}`)}
                    className="w-24 h-36 bg-white/5 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 cursor-pointer hover:border-white/20 transition-all"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <HiClock className="text-gray-600 text-3xl" />
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() => navigate(`/${item.titleType}/${item.titleId}`)}
                      className="text-white font-semibold text-lg mb-1 truncate cursor-pointer hover:text-accent-cyan transition-colors"
                    >
                      Title #{item.titleId}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                      <span className="capitalize">{item.titleType}</span>
                      <span>•</span>
                      <span>
                        {new Date(item.watchedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {item.completed && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-green-400">
                            <HiCheck size={16} />
                            Completed
                          </span>
                        </>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs text-gray-400">{item.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            item.completed ? 'bg-green-500' : 'bg-accent-cyan'
                          )}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Rating */}
                    {item.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <HiStar className="text-yellow-500" size={16} />
                        <span className="text-gray-300">{item.rating}/10</span>
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className={cn(
                      'p-2 rounded-lg',
                      'bg-white/5 border border-white/10',
                      'text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30',
                      'transition-all opacity-0 group-hover:opacity-100'
                    )}
                    aria-label="Remove from history"
                  >
                    <HiX size={20} />
                  </button>
                </div>
              </m.div>
            ))}
          </m.div>
        )}
      </div>
    </div>
  );
};

export default History;
