import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { MovieCard, SkelatonLoader } from '@/common';
import { CatalogHeader, Search } from './components';
import { useGetShowsQuery } from '@/services/TMDB';
import { smallMaxWidth } from '@/styles';
import { IMovie } from '@/types';

const Catalog = () => {
  const [page, setPage] = useState(1);
  const [shows, setShows] = useState<IMovie[]>([]);
  const [isCategoryChanged, setIsCategoryChanged] = useState<boolean>(false);
  const [query, setQuery] = useSearchParams();
  const { category } = useParams();

  const type = query.get('type') || 'popular';
  const searchQuery = query.get('search') || '';

  const { data, isLoading, isFetching } = useGetShowsQuery({
    category,
    page,
    searchQuery,
    type,
  });

  useEffect(() => {
    setPage(1);
    setIsCategoryChanged(true);
  }, [category, searchQuery]);

  useEffect(() => {
    if (isLoading || isFetching) return;

    if (data?.results) {
      if (page > 1) {
        setShows((prev) => [...prev, ...data.results]);
      } else {
        setShows([...data.results]);
        setIsCategoryChanged(false);
      }
    }
  }, [data, isFetching, isLoading, page]);

  return (
    <>
      <CatalogHeader category={String(category)} />
      <section className={`${smallMaxWidth}`}>
        <Search setQuery={setQuery} />

        <div className="rounded-[18px] border border-white/10 bg-[linear-gradient(145deg,rgba(33,12,12,0.72),rgba(18,8,8,0.52))] p-4 sm:p-6">
          {isLoading || isCategoryChanged ? (
            <SkelatonLoader isMoviesSliderLoader={false} />
          ) : (
            <div className="flex flex-wrap xs:gap-4 gap-[14px] justify-center">
              {shows?.map((movie) => (
                <div
                  key={movie.id}
                  className="flex flex-col xs:gap-4 gap-2 xs:max-w-[170px] max-w-[124px] rounded-lg lg:mb-6 md:mb-5 sm:mb-4 mb-[10px]"
                >
                  <MovieCard movie={movie} category={String(category)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {isFetching && !isCategoryChanged ? (
          <SkelatonLoader
            isMoviesSliderLoader={false}
            className="md:pt-8 sm:pt-7 pt-6"
          />
        ) : (
          <div className="w-full flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setPage(page + 1);
              }}
              disabled={isFetching}
              className="sm:py-3 xs:py-[8px] py-2 sm:px-6 xs:px-5 px-[14px] bg-[#d93a3a] text-gray-50 rounded-2xl md:text-[15.25px] sm:text-[14.75px] xs:text-[14px] text-[12.75px] shadow-md hover:bg-[#e14949] transition-all duration-300 font-semibold font-nunito lg:my-8 my-7"
            >
              Load more
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Catalog;
