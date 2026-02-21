import { useState, useEffect } from "react";
import { Loader, Error, Section, PersonalSection } from "@/common";
import { Hero, WeeklySpotlight, TopTenWeekly } from "./components";
import { Link } from "react-router-dom";

import { titlesService } from "@/services/titlesService";
import { historyService } from "@/services/historyService";
import { recommendationService } from "@/services/recommendationService";
import { useLanguage } from "@/context/languageContext";
import { useAuth } from "@/context/authContext";
import { maxWidth } from "@/styles";
import { sections } from "@/constants";
import { cn } from "@/utils/helper";
import type { IMovie } from "@/types";
import type { WatchHistory, Recommendation } from "@/types/user";

interface MovieWithVideos {
  id: string;
  title?: string;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  original_title: string;
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

const getIsoWeekNumber = (date: Date) => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const Home = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [popularMovies, setPopularMovies] = useState<MovieWithVideos[]>([]);
  const [weeklySpotlight, setWeeklySpotlight] = useState<(MovieWithVideos & {
    mediaType: "movie" | "tv";
    release_date?: string;
    first_air_date?: string;
    genres?: Array<{ id: number; name: string }>;
    runtime?: number;
    episode_run_time?: number[];
  }) | null>(null);
  const [spotlightWeek, setSpotlightWeek] = useState<number>(getIsoWeekNumber(new Date()));
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Personal sections data
  const [history, setHistory] = useState<IMovie[]>([]);
  const [recommendations, setRecommendations] = useState<IMovie[]>([]);

  // Helper function to map recommendation data to IMovie format
  const mapRecommendationToIMovie = (item: Recommendation): IMovie | null => {
    try {
      return {
        id: String(item.titleId),
        poster_path: item.title.posterPath,
        original_title: item.title.title,
        name: item.title.title,
        overview: item.title.overview,
        backdrop_path: item.title.backdropPath,
        vote_average: item.title.voteAverage,
      };
    } catch (err) {
      console.error('Error mapping recommendation to IMovie:', err);
      return null;
    }
  };

  // Fetch popular movies with videos for hero section
  useEffect(() => {
    const fetchPopularMoviesWithVideos = async () => {
      try {
        setIsLoading(true);
        const trending = await titlesService.getTrending('movie');
        const topMovies = trending.results.slice(0, 5);

        // Fetch full details (including videos) for each movie
        const moviesWithVideos = await Promise.all(
          topMovies.map(async (movie) => {
            try {
              const details = await titlesService.getDetails(movie.id, 'movie');
              return {
                ...movie,
                ...details,
                id: String(movie.id),
                name: details.name || details.title || movie.name || movie.title || '',
                original_title: details.title || details.name || movie.title || '',
              };
            } catch (err) {
              // If details fail, return movie without videos
              return {
                ...movie,
                id: String(movie.id),
                name: movie.name || movie.title || '',
                original_title: movie.title || '',
              };
            }
          })
        );

        setPopularMovies(moviesWithVideos);
      } catch (err) {
        console.error('Failed to fetch popular movies:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMoviesWithVideos();
  }, []);

  useEffect(() => {
    const fetchWeeklySpotlight = async () => {
      try {
        const week = getIsoWeekNumber(new Date());
        setSpotlightWeek(week);

        const mediaType: "movie" | "tv" = week % 2 === 0 ? "movie" : "tv";
        const trending = await titlesService.getTrending(mediaType);
        const candidates = trending.results.filter((item) => !!item.backdrop_path);
        const pickPool = candidates.length > 0 ? candidates : trending.results;

        if (!pickPool.length) {
          return;
        }

        const pick = pickPool[week % pickPool.length];
        const details = await titlesService.getDetails(pick.id, mediaType);

        setWeeklySpotlight({
          ...pick,
          ...details,
          id: String(pick.id),
          name: details.name || details.title || pick.name || pick.title || "",
          original_title: details.title || details.name || pick.title || "",
          mediaType,
        });
      } catch (err) {
        console.error("Failed to fetch weekly spotlight:", err);
      }
    };

    fetchWeeklySpotlight();
  }, []);

  // Fetch personal sections if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPersonalData = async () => {
      try {
        // Fetch history and recommendations in parallel
        const [historyData, recommendationsData] = await Promise.all([
          historyService.getHistory(10).catch(() => []),
          recommendationService.getPersonalizedRecommendations(20).catch(() => []),
        ]);

        // Map recommendations
        const mappedRecommendations = recommendationsData
          .map(item => mapRecommendationToIMovie(item))
          .filter((item): item is IMovie => item !== null);
        setRecommendations(mappedRecommendations);

        // For history, fetch title details since we only have IDs
        const historyWithDetails = await Promise.all(
          historyData.slice(0, 10).map(async (item: WatchHistory) => {
            try {
              const details = await titlesService.getDetails(item.titleId, item.titleType);
              return {
                id: String(item.titleId),
                poster_path: details.poster_path || '',
                original_title: details.title || details.name || '',
                name: details.name || details.title || '',
                overview: details.overview || '',
                backdrop_path: details.backdrop_path || '',
                vote_average: details.vote_average,
              } as IMovie;
            } catch (err) {
              return null;
            }
          })
        );
        const filteredHistory = historyWithDetails.filter((item): item is IMovie => item !== null);
        setHistory(filteredHistory);
      } catch (err) {
        console.error('Failed to fetch personal data:', err);
      }
    };

    fetchPersonalData();
  }, [isAuthenticated]);

  // Map section keys to translated titles
  const getSectionTitle = (category: string, type: string) => {
    const key = `${category}_${type}`;
    const titleMap: Record<string, string> = {
      'movie_popular': t.home.trendingMovies,
      'movie_top_rated': t.home.topRatedMovies,
      'tv_popular': t.home.trendingSeries,
      'tv_top_rated': t.home.topRatedSeries,
    };
    return titleMap[key] || '';
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Unable to fetch the movies! " />;
  }

  return (
    <>
      <Hero movies={popularMovies} />
      <div className={cn(maxWidth, "lg:mt-12 md:mt-8 sm:mt-6 xs:mt-4 mt-2")}>
        <TopTenWeekly />

        {/* Personal sections - only show if user is authenticated and has content */}
        {isAuthenticated && (
          <>
            {history.length > 0 && (
              <PersonalSection
                title={t.history?.continueWatching || "Continue Watching"}
                movies={history}
                viewAllLink="/history"
              />
            )}
            {recommendations.length > 0 && (
              <PersonalSection
                title={t.recommendations?.title || "Recommended for You"}
                movies={recommendations}
                viewAllLink="/recommendations"
              />
            )}
          </>
        )}

        {/* Default sections */}
        {sections.map(({ category, type }, index) => (
          <div key={`${category}_${type}`}>
            {weeklySpotlight && index === 3 ? (
              <WeeklySpotlight item={weeklySpotlight} weekNumber={spotlightWeek} />
            ) : null}
            <Section
              title={getSectionTitle(category, type)}
              category={category}
              type={type}
            />
          </div>
        ))}

        {weeklySpotlight && sections.length < 4 ? (
          <WeeklySpotlight item={weeklySpotlight} weekNumber={spotlightWeek} />
        ) : null}

        <div className="mt-4 mb-10 rounded-[18px] border border-[rgba(255,255,255,0.1)] bg-[linear-gradient(120deg,rgba(145,35,35,0.48),rgba(64,16,16,0.62))] p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-[760px]">
            <h3 className="font-roboto text-[34px] sm:text-[42px] text-[#f5f1f1] leading-[1.05]">
              Un film ou une serie te manque ?
            </h3>
            <p className="text-[#ead3d3] text-[17px] mt-3">
              Propose-le sur notre wishlist et vote pour les demandes de la communaute.
            </p>
          </div>
          <Link
            to="/catalogue"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold"
          >
            Voir le Wishlist
          </Link>
        </div>

        <div className="mb-12 rounded-[18px] border border-[rgba(255,255,255,0.1)] bg-[linear-gradient(120deg,rgba(38,26,26,0.88),rgba(20,13,13,0.82))] p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-[760px]">
            <h3 className="font-roboto text-[32px] sm:text-[38px] text-[#f5f1f1] leading-[1.05]">
              Un souci, une question ? Rejoins le Discord
            </h3>
            <p className="text-[#cbbdbd] text-[17px] mt-3">
              Mises a jour, infos importantes, support et nouveautes en temps reel.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[#5865f2] hover:bg-[#6874ff] text-white font-semibold"
          >
            Notre Discord
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
