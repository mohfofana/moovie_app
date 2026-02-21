import { useState, useEffect } from "react";
import { Loader, Error, Section, PersonalSection } from "@/common";
import { Hero } from "./components";

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
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  original_title?: string;
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

const Home = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [popularMovies, setPopularMovies] = useState<MovieWithVideos[]>([]);
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
                original_title: details.title || details.name || movie.title,
              };
            } catch (err) {
              // If details fail, return movie without videos
              return {
                ...movie,
                original_title: movie.title,
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
        {sections.map(({ category, type }) => (
          <Section
            title={getSectionTitle(category, type)}
            category={category}
            type={type}
            key={`${category}_${type}`}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
