import { useEffect, useMemo, useState } from 'react';
import { m } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { HiBookmark, HiHeart, HiOutlineDownload, HiOutlineEye } from 'react-icons/hi';
import { FaPlay } from 'react-icons/fa';

import { Poster, Loader, Error, Section, VideoBackground } from '@/common';
import { Casts, Videos, Genre } from './components';

import { titlesService, type TitleDetails } from '@/services/titlesService';
import { watchlistService } from '@/services/watchlistService';
import { useLanguage } from '@/context/languageContext';
import { useMotion } from '@/hooks/useMotion';
import { maxWidth, paragraph } from '@/styles';
import { cn } from '@/utils/helper';
import { IMG_URL } from '@/utils/config';

type ExtendedTitleDetails = TitleDetails & {
  seasons?: Array<{
    id: number;
    name: string;
    overview?: string;
    episode_count?: number;
    air_date?: string;
    poster_path?: string;
    still_path?: string;
  }>;
  number_of_seasons?: number;
  runtime?: number;
  episode_run_time?: number[];
};

const tabs = ['Episodes', 'Videos & Bande Annonces', 'Contenu similaire', 'Casting & Production'];

const Detail = () => {
  const { t } = useLanguage();
  const { category, id } = useParams();
  const [show, setShow] = useState<boolean>(false);
  const [movie, setMovie] = useState<ExtendedTitleDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const { fadeDown, staggerContainer } = useMotion();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || !category) return;

      setIsLoading(true);
      setIsError(false);

      try {
        const type = category === 'movie' ? 'movie' : 'tv';
        const data = await titlesService.getDetails(Number(id), type);
        setMovie(data as ExtendedTitleDetails);

        const [inWatchlist, inFavorites] = await Promise.all([
          watchlistService.isInWatchlist(Number(id)),
          watchlistService.isFavorited(Number(id)),
        ]);
        setIsInWatchlist(inWatchlist);
        setIsInFavorites(inFavorites);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, category]);

  useEffect(() => {
    document.title = movie && !isLoading ? movie.title || movie.name || 'Cinescope' : 'Cinescope';
    return () => {
      document.title = 'Cinescope';
    };
  }, [movie, isLoading]);

  const handleWatchlistToggle = async () => {
    if (!id || !category) return;
    setIsAddingToWatchlist(true);
    try {
      const type = category === 'movie' ? 'movie' : 'tv';
      if (isInWatchlist) {
        await watchlistService.removeFromWatchlist(id);
        setIsInWatchlist(false);
      } else {
        await watchlistService.addToWatchlist(Number(id), type);
        setIsInWatchlist(true);
      }
    } finally {
      setIsAddingToWatchlist(false);
    }
  };

  const handleFavoritesToggle = async () => {
    if (!id || !category) return;
    setIsAddingToFavorites(true);
    try {
      const type = category === 'movie' ? 'movie' : 'tv';
      if (isInFavorites) {
        await watchlistService.removeFromFavorites(id);
        setIsInFavorites(false);
      } else {
        await watchlistService.addToFavorites(Number(id), type);
        setIsInFavorites(true);
      }
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  const trailerKey = useMemo(() => {
    if (!movie?.videos?.results?.length) return null;
    const trailer = movie.videos.results.find((video: { type: string }) => video.type === 'Trailer');
    return trailer?.key || movie.videos.results[0]?.key || null;
  }, [movie]);

  if (isLoading) return <Loader />;
  if (isError || !movie) return <Error error='Something went wrong!' />;

  const title = movie.title || movie.name || '';
  const posterPath = movie.poster_path || '';
  const backdropPath = movie.backdrop_path || posterPath;
  const overview = movie.overview || '';
  const genres = movie.genres || [];
  const videos = movie.videos?.results || [];
  const casts = movie.credits?.cast || [];

  const yearText = (movie.first_air_date || movie.release_date || '').slice(0, 4) || '2024';
  const durationMinutes = movie.runtime || movie.episode_run_time?.[0] || 56;
  const durationText = `${Math.floor(durationMinutes / 60)}h${String(durationMinutes % 60).padStart(2, '0')}`;

  return (
    <>
      <section className='w-full relative'>
        <VideoBackground videoKey={trailerKey || undefined} backdropPath={backdropPath} />
        <div className='absolute inset-0 bg-gradient-to-b from-[rgba(7,4,4,0.26)] via-[rgba(7,4,4,0.65)] to-[rgba(7,4,4,0.92)] z-20' />

        <div className={cn(maxWidth, 'relative z-30 pt-24 pb-10')}>
          <div className='grid md:grid-cols-[280px_1fr] gap-8 items-start'>
            <Poster title={title} posterPath={posterPath} className='!block' />

            <m.div variants={staggerContainer(0.2, 0.3)} initial='hidden' animate='show' className='pt-4'>
              <m.h1 variants={fadeDown} className='font-roboto text-white text-[42px] sm:text-[64px] leading-none'>
                {title}
              </m.h1>

              <m.div variants={fadeDown} className='flex flex-wrap items-center gap-3 mt-4'>
                <span className='px-4 py-2 rounded-xl border border-white/60 text-white font-semibold'>16+</span>
                <span className='px-4 py-2 rounded-xl border border-white/60 text-white font-semibold'>* {(movie.vote_average || 8).toFixed(1)}/10</span>
                {genres.slice(0, 4).map((genre) => (
                  <Genre key={genre.id} name={genre.name} />
                ))}
                <span className='text-white'>.</span>
                <span className='text-white'>{yearText}</span>
                <span className='text-white'>.</span>
                <span className='text-white'>{durationText}</span>
              </m.div>

              <m.p variants={fadeDown} className={cn(paragraph, 'text-[#f0e5e5] mt-5 max-w-[900px]')}>
                {overview.length > 520 && !show ? `${overview.slice(0, 520)}...` : overview}
                {overview.length > 520 && (
                  <button className='ml-2 text-[#f26f6f] font-semibold hover:underline' onClick={() => setShow((p) => !p)}>
                    {show ? t.detail.showLess : t.detail.readMore}
                  </button>
                )}
              </m.p>

              <m.div variants={fadeDown} className='flex flex-wrap items-center gap-3 mt-7'>
                <button className='px-7 py-3 rounded-2xl bg-[#d93a3a] hover:bg-[#e14949] text-white font-semibold inline-flex items-center gap-3'>
                  <FaPlay size={14} /> Lecture
                </button>
                <button
                  onClick={handleFavoritesToggle}
                  disabled={isAddingToFavorites}
                  className='px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold inline-flex items-center gap-2 hover:bg-white/16'
                >
                  <HiHeart /> {isInFavorites ? 'Favori' : ` ${t.detail.addToFavorites}`}
                </button>
                <button
                  onClick={handleWatchlistToggle}
                  disabled={isAddingToWatchlist}
                  className='px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold inline-flex items-center gap-2 hover:bg-white/16'
                >
                  <HiBookmark /> {isInWatchlist ? 'Watchlist' : t.detail.addToWatchlist}
                </button>
                <button className='px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white inline-flex items-center gap-2 hover:bg-white/16'>
                  <HiOutlineEye /> 977
                </button>
                <button className='px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white inline-flex items-center gap-2 hover:bg-white/16'>
                  <HiOutlineDownload /> 19
                </button>
              </m.div>

              <div className='mt-6'>
                <Casts casts={casts} />
              </div>
            </m.div>
          </div>
        </div>
      </section>

      <section className={cn(maxWidth, 'py-6')}>
        <div className='flex flex-wrap gap-3'>
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              className={cn(
                'px-5 py-3 rounded-2xl border text-sm sm:text-base font-semibold transition-all',
                idx === 0
                  ? 'bg-white text-black border-white'
                  : 'bg-white/8 text-white border-white/15 hover:bg-white/14'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className='mt-6 rounded-2xl bg-[rgba(80,25,25,0.32)] border border-[rgba(255,255,255,0.08)] p-4 text-[#f3dada] text-sm sm:text-base'>
          Petite precision: Les informations de saisons et episodes proviennent de TMDB et peuvent differer selon certaines regions.
        </div>
      </section>

      {category === 'tv' && (movie.seasons?.length || 0) > 0 && (
        <section className={cn(maxWidth, 'pb-8')}>
          <div className='flex flex-wrap items-center justify-between gap-3 mb-5'>
            <button className='px-5 py-3 rounded-2xl bg-white/12 border border-white/15 text-white font-semibold'>
              Saison 1
            </button>
            <div className='flex gap-3'>
              <button className='px-5 py-3 rounded-2xl bg-white/12 border border-white/15 text-white font-semibold'>
                Afficher les telecharges uniquement
              </button>
              <button className='px-5 py-3 rounded-2xl bg-white/12 border border-white/15 text-white font-semibold'>
                Activer anti-spoil
              </button>
            </div>
          </div>

          <div className='grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5'>
            {movie.seasons?.slice(0, 8).map((season, idx) => {
              const imagePath = season.poster_path || backdropPath;
              return (
                <article key={season.id} className='rounded-2xl overflow-hidden border border-white/10 bg-[rgba(17,7,7,0.72)]'>
                  <div className='relative h-[180px]'>
                    <img
                      src={`${IMG_URL}/original/${imagePath}`}
                      alt={season.name}
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute top-3 right-3 bg-white text-black rounded-xl p-2'>
                      <HiOutlineDownload size={18} />
                    </div>
                  </div>
                  <div className='p-4'>
                    <p className='text-[#d6c8c8] text-sm'>Saison {idx + 1} - {season.episode_count || 0} episodes</p>
                    <h3 className='text-white text-[32px] leading-tight mt-1 font-semibold'>{season.name}</h3>
                    <p className='text-[#e3d3d3] text-sm mt-2 line-clamp-4'>
                      {season.overview || 'Description indisponible pour cette saison.'}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <Videos videos={videos} />

      <Section
        title={`Similar ${category === 'movie' ? 'movies' : 'series'}`}
        category={String(category)}
        className={`${maxWidth}`}
        id={Number(id)}
        showSimilarShows
      />
    </>
  );
};

export default Detail;
