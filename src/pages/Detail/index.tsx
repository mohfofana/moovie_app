import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useParams } from "react-router-dom";
import { HiBookmark, HiHeart } from "react-icons/hi";

import { Poster, Loader, Error, Section } from "@/common";
import { Casts, Videos, Genre } from "./components";

import { titlesService, type TitleDetails } from "@/services/titlesService";
import { watchlistService } from "@/services/watchlistService";
import { useMotion } from "@/hooks/useMotion";
import { mainHeading, maxWidth, paragraph } from "@/styles";
import { cn } from "@/utils/helper";

const Detail = () => {
  const { category, id } = useParams();
  const [show, setShow] = useState<Boolean>(false);
  const [movie, setMovie] = useState<TitleDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const { fadeDown, staggerContainer } = useMotion();

  // Fetch movie/show details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || !category) return;

      setIsLoading(true);
      setIsError(false);

      try {
        const type = category === 'movie' ? 'movie' : 'tv';
        const data = await titlesService.getDetails(Number(id), type);
        setMovie(data);

        // Check if in watchlist/favorites
        const [inWatchlist, inFavorites] = await Promise.all([
          watchlistService.isInWatchlist(Number(id)),
          watchlistService.isFavorited(Number(id)),
        ]);
        setIsInWatchlist(inWatchlist);
        setIsInFavorites(inFavorites);
      } catch (error) {
        console.error('Failed to fetch title details:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, category]);

  useEffect(() => {
    document.title =
      (movie?.title || movie?.name) && !isLoading
        ? movie.title || movie.name
        : "Cinescope";

    return () => {
      document.title = "Cinescope";
    };
  }, [movie?.title, isLoading, movie?.name]);

  const toggleShow = () => setShow((prev) => !prev);

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
    } catch (error) {
      console.error('Failed to update watchlist:', error);
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
    } catch (error) {
      console.error('Failed to update favorites:', error);
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !movie) {
    return <Error error="Something went wrong!" />;
  }

  const {
    title,
    poster_path: posterPath,
    overview,
    name,
    genres,
    videos,
    credits,
  } = movie;

  const backgroundStyle = {
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(0, 217, 255, 0.08), transparent 35%),
      radial-gradient(circle at 80% 70%, rgba(255, 0, 128, 0.06), transparent 35%),
      linear-gradient(to top, rgba(10,10,10,1), rgba(10,10,10,0.98) 60%, rgba(10,10,10,0.85) 80%, rgba(10,10,10,0.5)),
      url('https://image.tmdb.org/t/p/original/${posterPath}')`,
    backgroundPosition: "top center",
    backgroundSize: "cover",
  };

  return (
    <>
      <section className="w-full relative" style={backgroundStyle}>
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div
          className={`${maxWidth} lg:py-40 sm:py-36 sm:pb-32 xs:py-32 xs:pb-16 pt-28 pb-12 flex flex-row lg:gap-16 md:gap-12 gap-10 justify-center relative z-10`}
        >
          <Poster title={title} posterPath={posterPath} />
          <m.div
            variants={staggerContainer(0.2, 0.4)}
            initial="hidden"
            animate="show"
            className="text-gray-200 sm:max-w-[80vw] max-w-[90vw] md:max-w-[560px] font-nunito flex flex-col lg:gap-6 sm:gap-5 xs:gap-4 gap-3 mb-8 flex-1"
          >
            <m.h2
              variants={fadeDown}
              className={cn(mainHeading, "md:max-w-[480px] leading-tight tracking-tight")}
            >
              {title || name}
            </m.h2>

            <m.ul
              variants={fadeDown}
              className="flex flex-row items-center sm:gap-3 xs:gap-2.5 gap-2 flex-wrap"
            >
              {genres.map((genre: { name: string; id: number }) => {
                return <Genre key={genre.id} name={genre.name} />;
              })}
            </m.ul>

            {/* Action Buttons */}
            <m.div
              variants={fadeDown}
              className="flex flex-row gap-3 items-center"
            >
              <button
                onClick={handleWatchlistToggle}
                disabled={isAddingToWatchlist}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-200",
                  isInWatchlist
                    ? "bg-white/90 text-black hover:bg-white"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20",
                  isAddingToWatchlist && "opacity-50 cursor-not-allowed"
                )}
              >
                <HiBookmark size={18} />
                {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </button>

              <button
                onClick={handleFavoritesToggle}
                disabled={isAddingToFavorites}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-200",
                  isInFavorites
                    ? "bg-accent-magenta text-white hover:bg-accent-magenta/90"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20",
                  isAddingToFavorites && "opacity-50 cursor-not-allowed"
                )}
              >
                <HiHeart size={18} />
                {isInFavorites ? "Favorited" : "Add to Favorites"}
              </button>
            </m.div>

            <m.p variants={fadeDown} className={cn(paragraph, "leading-relaxed text-gray-300")}>
              <span>
                {overview.length > 300
                  ? `${show ? overview : `${overview.slice(0, 300)}...`}`
                  : overview}
              </span>
              <button
                type="button"
                className={cn(
                  `font-bold ml-1.5 text-accent-cyan hover:text-accent-magenta transition-colors duration-300`,
                  overview.length > 300 ? "inline-block" : "hidden"
                )}
                onClick={toggleShow}
              >
                {!show ? "Read more →" : "Show less ←"}
              </button>
            </m.p>

            <Casts casts={credits?.cast || []} />
          </m.div>
        </div>
      </section>

      <Videos videos={videos.results} />

      <Section
        title={`Similar ${category === "movie" ? "movies" : "series"}`}
        category={String(category)}
        className={`${maxWidth}`}
        id={Number(id)}
        showSimilarShows
      />
    </>
  );
};

export default Detail;
