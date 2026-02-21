import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { HiSearch } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { titlesService } from '@/services/titlesService';
import { cn } from '@/utils/helper';
import { IMG_URL } from '@/utils/config';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type?: string;
  vote_average?: number;
}

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Search without type filter to get both movies and TV shows
        const response = await titlesService.search(debouncedQuery);
        const results = response.results.slice(0, 6).map((item: SearchResult) => ({
          ...item,
          media_type: item.media_type || 'movie',
        }));
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Combined results
  const combinedResults = searchResults;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    const category = result.media_type === 'movie' ? 'movie' : 'tv';
    navigate(`/${category}/${result.id}`);
    setSearchQuery('');
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchQuery.length >= 2) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-200',
          'bg-white/5 border border-white/10',
          isFocused && 'bg-white/8 border-white/20'
        )}
      >
        <HiSearch className="text-gray-400 text-[18px] flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search movies & shows..."
          className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-[14px] w-[200px] xl:w-[260px]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoClose size={18} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && combinedResults.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full min-w-[320px] dark-glass rounded-2xl overflow-hidden border border-white/10"
          >
            <div className="max-h-[400px] overflow-y-auto">
              {combinedResults.map((result: SearchResult) => {
                const title = result.title || result.name || 'Unknown';
                const imageUrl = result.poster_path
                  ? `${IMG_URL}/w185${result.poster_path}`
                  : result.backdrop_path
                  ? `${IMG_URL}/w300${result.backdrop_path}`
                  : null;

                return (
                  <button
                    key={`${result.media_type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-white/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <HiSearch className="text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">
                        {title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-400 text-xs capitalize">
                          {result.media_type === 'movie' ? 'Movie' : 'TV Show'}
                        </span>
                        {result.vote_average && result.vote_average > 0 && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-400 text-xs">
                              ★ {result.vote_average.toFixed(1)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* View All Results */}
            {debouncedQuery && (
              <div className="border-t border-white/10 p-3">
                <button
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(debouncedQuery)}`);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-accent-cyan text-sm hover:underline"
                >
                  View all results for "{debouncedQuery}"
                </button>
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
