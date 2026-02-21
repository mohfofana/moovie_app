import { memo } from 'react';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { Poster, VideoBackground } from '@/common';
import { useGlobalContext } from '@/context/globalContext';
import { mainHeading, maxWidth, paragraph, watchBtn } from '@/styles';
import { IMovie } from '@/types';
import { cn } from '@/utils/helper';
import { useMotion } from '@/hooks/useMotion';

interface MovieWithVideos extends IMovie {
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      type: string;
      site?: string;
    }>;
  };
}

const HeroSlide = ({ movie }: { movie: MovieWithVideos }) => {
  const { getTrailerId, setIsModalOpen } = useGlobalContext();
  const navigate = useNavigate();
  const { fadeDown, staggerContainer } = useMotion();

  const {
    overview,
    original_title: title,
    poster_path: posterPath,
    backdrop_path: backdropPath,
    videos,
    id,
    vote_average,
  } = movie;

  const getTrailerKey = () => {
    if (!videos?.results || videos.results.length === 0) return null;

    const trailer = videos.results.find((video) => video.type === 'Trailer');
    if (trailer) return trailer.key;

    return videos.results[0]?.key || null;
  };

  const videoKey = getTrailerKey();

  const showTrailer = () => {
    getTrailerId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      <VideoBackground videoKey={videoKey || undefined} backdropPath={backdropPath} />

      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,4,4,0.62)] via-[rgba(8,4,4,0.3)] to-[rgba(8,4,4,0.66)] z-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.12)] to-[rgba(9,4,4,0.92)] z-20" />

      <div className={cn(maxWidth, 'relative z-30 h-full flex items-center lg:gap-16 gap-8 pt-20')}>
        <m.div
          variants={staggerContainer(0.2, 0.3)}
          initial="hidden"
          animate="show"
          className="text-white md:max-w-[620px] sm:max-w-[86vw] max-w-[94vw] flex flex-col gap-4"
        >
          <m.span variants={fadeDown} className="inline-flex w-fit rounded-xl bg-[rgba(218,72,72,0.2)] border border-[rgba(255,120,120,0.35)] px-3 py-1 text-xs font-semibold">
            Selection de l'equipe
          </m.span>

          <m.h2 variants={fadeDown} className={cn(mainHeading, 'text-shadow sm:max-w-[600px] max-w-[440px]')}>
            {title}
          </m.h2>

          <m.div variants={fadeDown} className="flex flex-wrap items-center gap-3 text-white/95 text-sm sm:text-base">
            <span className="px-3 py-1 rounded-xl border border-white/60">16+</span>
            <span className="px-3 py-1 rounded-xl border border-white/60">* {(vote_average || 8).toFixed(1)}/10</span>
            <span>Drame</span>
            <span>.</span>
            <span>2h10</span>
          </m.div>

          <m.p variants={fadeDown} className={cn(paragraph, 'text-[#f2e9e9] sm:max-w-[88%] max-w-[96%]')}>
            {overview.length > 250 ? `${overview.substring(0, 250)}...` : overview}
          </m.p>

          <m.div variants={fadeDown} className="flex flex-row items-center gap-3 mt-3">
            <button
              type="button"
              name="watch-now"
              className={cn(watchBtn, 'watch-trailer')}
              onClick={() => navigate(`/movie/${id}`)}
            >
              Voir la fiche
            </button>
            <button
              type="button"
              name="watch-trailer"
              className={cn(watchBtn, 'bg-[#d33b3b] text-white hover:bg-[#e24b4b]')}
              onClick={showTrailer}
            >
              Lecture
            </button>
          </m.div>
        </m.div>

        <Poster
          title={title}
          posterPath={posterPath}
          className="mr-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.62)]"
        />
      </div>
    </div>
  );
};

export default memo(HeroSlide);
