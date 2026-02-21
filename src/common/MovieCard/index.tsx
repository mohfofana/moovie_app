import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiBookmark, HiInformationCircle } from 'react-icons/hi';

import Image from '../Image';
import { IMovie } from '@/types';
import { useMediaQuery } from 'usehooks-ts';
import { watchlistService } from '@/services/watchlistService';
import { useAuth } from '@/context/authContext';
import { useLanguage } from '@/context/languageContext';

const MovieCard = ({
  movie,
  category,
  onHoverStart,
  onHoverEnd,
}: {
  movie: IMovie;
  category: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}) => {
  const { poster_path, original_title: title, name, id, vote_average } = movie;
  const inferredType = category === 'tv' ? 'Serie' : 'Film';
  const isCompact = useMediaQuery('(max-width: 1024px)');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { locale } = useLanguage();

  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const movieWithDates = movie as IMovie & {
    release_date?: string;
    first_air_date?: string;
  };

  const displayTitle = (title?.length > 50 ? title.split(':')[0] : title) || name;
  const description = movie.overview?.length > 120 ? `${movie.overview.slice(0, 120)}...` : movie.overview;
  const year = (movieWithDates.release_date || movieWithDates.first_air_date || '').slice(0, 4) || '2024';

  const handleAddToWatchlist = async () => {
    if (isAdding || isAdded) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await watchlistService.addToWatchlist(Number(id), category === 'tv' ? 'tv' : 'movie');
      setIsAdded(true);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className='group/card relative w-[200px]'
      onMouseEnter={!isCompact ? onHoverStart : undefined}
      onMouseLeave={!isCompact ? onHoverEnd : undefined}
    >
      <Link
        to={`/${category}/${id}`}
        className='rounded-[12px] relative block w-[200px] xs:h-[295px] h-[255px] overflow-hidden border border-white/10 bg-[#130909] transition-all duration-200 hover:-translate-y-1'
      >
        <Image
          height={295}
          width={200}
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt={movie.original_title}
          className='object-cover rounded-[12px] w-full h-full'
          effect='zoomIn'
        />

        <div className='absolute top-2 left-2 bg-black/80 rounded-[8px] px-3 py-1'>
          <span className='text-white font-semibold text-[12px]'>{inferredType}</span>
        </div>

        {vote_average && (
          <div className='absolute top-2 right-2 bg-black/70 rounded-[8px] px-2 py-1'>
            <span className='text-white font-semibold text-[11px]'>* {vote_average.toFixed(1)}</span>
          </div>
        )}
      </Link>

      <h4 className='text-[#f4eaea] text-left text-[14px] font-medium leading-tight tracking-tight px-0.5 mt-2.5 w-[200px]'>
        {displayTitle}
      </h4>

      {!isCompact && (
        <div className='pointer-events-none absolute top-0 left-0 z-30 w-[380px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 ease-out'>
          <div className='pointer-events-auto rounded-[14px] overflow-hidden border border-white/15 shadow-[0_20px_44px_rgba(0,0,0,0.65)] bg-[#403734]'>
            <Link to={`/${category}/${id}`} className='block relative h-[200px]'>
              <img
                src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
                alt={displayTitle}
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
              <div className='absolute left-0 right-0 bottom-3 flex justify-center gap-2'>
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToWatchlist();
                  }}
                  className='h-11 w-11 rounded-xl bg-black/80 hover:bg-black text-white border border-white/35 inline-flex items-center justify-center'
                  title='Ajouter a ma liste'
                >
                  <HiBookmark size={20} />
                </button>
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/${category}/${id}`);
                  }}
                  className='h-11 w-11 rounded-xl bg-black/80 hover:bg-black text-white border border-white/35 inline-flex items-center justify-center'
                  title='Voir details'
                >
                  <HiInformationCircle size={20} />
                </button>
              </div>
            </Link>

            <div className='p-4'>
              <h4 className='text-white text-[24px] font-semibold leading-tight mb-3'>{displayTitle}</h4>
              <div className='flex flex-wrap gap-2 mb-3'>
                <span className='text-white/90 text-[12px] px-2 py-1 bg-black/45 rounded-md'>{inferredType}</span>
                <span className='text-white/90 text-[12px] px-2 py-1 bg-black/45 rounded-md'>{year}</span>
                {vote_average && (
                  <span className='text-white/90 text-[12px] px-2 py-1 bg-black/45 rounded-md'>
                    * {vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              <p className='text-[#f0e8e8] text-[14px] leading-relaxed'>
                {description || (locale === 'en' ? 'No description available.' : 'Aucune description disponible.')}
              </p>
              {(isAdding || isAdded) && (
                <p className='text-[12px] text-[#d7d0d0] mt-3'>
                  {isAdded ? 'Ajoute a la watchlist' : 'Ajout en cours...'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
