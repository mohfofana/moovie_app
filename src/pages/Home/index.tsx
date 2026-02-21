import { useState, useEffect } from "react";
import { Loader, Error, Section } from "@/common";
import { Hero } from "./components";

import { titlesService } from "@/services/titlesService";
import { useLanguage } from "@/context/languageContext";
import { maxWidth } from "@/styles";
import { sections } from "@/constants";
import { cn } from "@/utils/helper";

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
  const [popularMovies, setPopularMovies] = useState<MovieWithVideos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

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
