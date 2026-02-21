import { Loader, Error, Section } from "@/common";
import { Hero } from "./components";

import { useGetShowsQuery } from "@/services/TMDB";
import { useLanguage } from "@/context/languageContext";
import { maxWidth } from "@/styles";
import { sections } from "@/constants";
import { cn } from "@/utils/helper";

const Home = () => {
  const { t } = useLanguage();
  const { data, isLoading, isError } = useGetShowsQuery({
    category: "movie",
    type: "popular",
    page: 1,
  });

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

  const popularMovies = data?.results.slice(0, 5);

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
