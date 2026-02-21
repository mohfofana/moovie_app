import { memo } from 'react';
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Poster, VideoBackground } from "@/common";
import { useGlobalContext } from "@/context/globalContext";
import { mainHeading, maxWidth, paragraph, watchBtn } from "@/styles";
import { IMovie } from "@/types";
import { cn } from "@/utils/helper";
import { useMotion } from "@/hooks/useMotion";

interface MovieWithVideos extends IMovie {
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      type: string;
      site: string;
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
  } = movie;

  // Get trailer video key
  const getTrailerKey = () => {
    if (!videos?.results || videos.results.length === 0) {
      return null;
    }

    // Try to find a trailer
    const trailer = videos.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    if (trailer) {
      return trailer.key;
    }

    // Fallback to first YouTube video
    const firstVideo = videos.results.find((video) => video.site === 'YouTube');
    return firstVideo?.key || null;
  };

  const videoKey = getTrailerKey();

  const showTrailer = () => {
    getTrailerId(id);
    setIsModalOpen(true);
  };

  const handleWatchNow = () => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="h-full w-full relative">
      {/* Video/Image Background */}
      <VideoBackground
        videoKey={videoKey || undefined}
        backdropPath={backdropPath}
      />

      {/* Content */}
      <div
        className={cn(
          maxWidth,
          `mx-auto flex items-center h-full flex-row lg:gap-36 sm:gap-24 gap-8 relative z-20`
        )}
      >
        <m.div
          variants={staggerContainer(0.2, 0.3)}
          initial="hidden"
          animate="show"
          className="text-white sm:max-w-[82vw] max-w-[92vw] md:max-w-[640px] font-nunito flex flex-col sm:gap-7 xs:gap-5 gap-4 sm:mb-8"
        >
          <m.h2
            variants={fadeDown}
            className={cn(
              mainHeading,
              "text-shadow"
            )}
          >
            {title}
          </m.h2>
          <m.p
            variants={fadeDown}
            className={cn(
              paragraph,
              "text-gray-300 sm:max-w-[85%] max-w-[95%] opacity-90"
            )}
          >
            {overview.length > 260 ? `${overview.substring(0, 260)}...` : overview}
          </m.p>
          <m.div
            variants={fadeDown}
            className="flex flex-row items-center gap-3 sm:mt-6 xs:mt-4 mt-3"
          >
            <button
              type="button"
              name="watch-trailer"
              className={cn(
                watchBtn,
                `watch-trailer`
              )}
              onClick={showTrailer}
            >
              ▶ Play
            </button>
            <button
              type="button"
              name="watch-now"
              className={cn(
                watchBtn,
                `bg-white/15 backdrop-blur-md hover:bg-white/25 text-white border-0 transition-all duration-250`
              )}
              onClick={handleWatchNow}
            >
              More Info
            </button>
          </m.div>
        </m.div>

        <Poster
          title={title}
          posterPath={posterPath}
          className="mr-auto drop-shadow-[0_32px_64px_rgba(0,0,0,0.6)] hover:drop-shadow-[0_36px_72px_rgba(0,0,0,0.7)] transition-all duration-400"
        />
      </div>
    </div>
  );
};

export default memo(HeroSlide);
