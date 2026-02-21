import { useEffect, useMemo, useState } from "react";
import { GoSearch } from "react-icons/go";
import { FiFilter } from "react-icons/fi";
import { TbDeviceTv } from "react-icons/tb";
import { Link, useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import { MovieCard, SkelatonLoader } from "@/common";
import Image from "@/common/Image";
import { useLanguage } from "@/context/languageContext";
import { useGetShowsQuery } from "@/services/TMDB";
import { maxWidth } from "@/styles";
import type { IMovie } from "@/types";
import { cn } from "@/utils/helper";
import { API_KEY, TMDB_API_BASE_URL } from "@/utils/config";

type ShelfConfig = {
  id: string;
  titleFr: string;
  titleEn: string;
  category: "movie" | "tv";
  filter: "movie" | "tv" | "anime";
  type: string;
};

type CategoryFilter = "all" | "movie" | "tv" | "anime";
type SortMode = "all" | "recent" | "rating";
type ProviderKey = "all" | "netflix" | "prime" | "apple" | "disney" | "max";

type SearchMovie = IMovie & {
  media_type?: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  original_language?: string;
  popularity?: number;
};

type ProviderOption = {
  key: ProviderKey;
  labelFr: string;
  labelEn: string;
  aliases: string[];
};

const shelfConfigs: ShelfConfig[] = [
  {
    id: "recent-movies",
    titleFr: "Derniers films ajoutes",
    titleEn: "Latest movies added",
    category: "movie",
    filter: "movie",
    type: "now_playing",
  },
  {
    id: "recent-series",
    titleFr: "Dernieres series ajoutees",
    titleEn: "Latest series added",
    category: "tv",
    filter: "tv",
    type: "airing_today",
  },
  {
    id: "anime-weekly",
    titleFr: "Animes de la semaine",
    titleEn: "Weekly anime picks",
    category: "tv",
    filter: "anime",
    type: "popular",
  },
  {
    id: "box-office",
    titleFr: "Box-office de la semaine",
    titleEn: "Weekly box office picks",
    category: "movie",
    filter: "movie",
    type: "popular",
  },
];

const providerOptions: ProviderOption[] = [
  { key: "all", labelFr: "Tous les providers", labelEn: "All providers", aliases: [] },
  { key: "netflix", labelFr: "Netflix", labelEn: "Netflix", aliases: ["Netflix"] },
  {
    key: "prime",
    labelFr: "Prime Video",
    labelEn: "Prime Video",
    aliases: ["Amazon Prime Video", "Prime Video"],
  },
  {
    key: "apple",
    labelFr: "Apple TV+",
    labelEn: "Apple TV+",
    aliases: ["Apple TV Plus", "Apple TV+"],
  },
  { key: "disney", labelFr: "Disney+", labelEn: "Disney+", aliases: ["Disney Plus"] },
  { key: "max", labelFr: "Max", labelEn: "Max", aliases: ["Max", "HBO Max"] },
];

const sortByMode = (items: SearchMovie[], mode: SortMode) => {
  const sorted = [...items];
  if (mode === "all") {
    return sorted;
  }
  if (mode === "rating") {
    return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  }

  return sorted.sort((a, b) => {
    const aDate = new Date(a.release_date || a.first_air_date || "1900-01-01").getTime();
    const bDate = new Date(b.release_date || b.first_air_date || "1900-01-01").getTime();
    return bDate - aDate;
  });
};

const isAnimeTitle = (movie: SearchMovie) => {
  const isAnimationGenre = movie.genre_ids?.includes(16);
  const isJapanese = movie.original_language === "ja";
  return Boolean(isAnimationGenre || isJapanese);
};

const CategoryRanking = ({
  title,
  items,
  loading,
}: {
  title: string;
  items: SearchMovie[];
  loading: boolean;
}) => {
  if (loading) {
    return (
      <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,rgba(31,12,12,0.88),rgba(17,8,8,0.72))] p-6 sm:p-8 lg:p-10 shadow-[0_20px_46px_rgba(0,0,0,0.38)]">
        <SkelatonLoader />
      </section>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,rgba(31,12,12,0.88),rgba(17,8,8,0.72))] p-6 sm:p-8 lg:p-10 shadow-[0_20px_46px_rgba(0,0,0,0.38)]">
      <h3 className="font-roboto sm:text-[30px] text-[24px] tracking-tight text-white font-semibold mb-5">
        {title}
      </h3>
      <Swiper slidesPerView="auto" spaceBetween={24} className="!overflow-visible">
        {items.map((item, index) => {
          const titleLabel = item.original_title || item.name;
          const mediaType = item.media_type === "tv" ? "tv" : "movie";
          const num = index + 1;
          const isDouble = num === 10;

          return (
            <SwiperSlide key={`rank-${mediaType}-${item.id}`} style={{ width: isDouble ? "318px" : "292px" }}>
              <Link to={`/${mediaType}/${item.id}`} className="relative flex items-end group select-none h-[320px]">
                <span
                  className="font-roboto font-black italic leading-[0.8] select-none pointer-events-none absolute bottom-0 left-0 z-0"
                  style={{
                    fontSize: isDouble ? "220px" : "250px",
                    left: isDouble ? "-26px" : "-20px",
                    color: "transparent",
                    WebkitTextStroke: "3px rgba(255,255,255,0.22)",
                    paintOrder: "stroke fill",
                  }}
                >
                  {num}
                </span>

                <div
                  className="relative z-10 transition-all duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1"
                  style={{ marginLeft: isDouble ? "108px" : "90px" }}
                >
                  <div className="w-[190px] h-[280px] rounded-[14px] overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.55)] group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.75)]">
                    <Image
                      height={280}
                      width={190}
                      src={`https://image.tmdb.org/t/p/w342/${item.poster_path}`}
                      alt={titleLabel}
                      className="w-full h-full object-cover"
                      effect="zoomIn"
                    />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

const CatalogShelf = ({
  config,
  activeCategory,
  latestOnly,
  sortMode,
  selectedProviderId,
  watchRegion,
  searchText,
}: {
  config: ShelfConfig;
  activeCategory: CategoryFilter;
  latestOnly: boolean;
  sortMode: SortMode;
  selectedProviderId?: number;
  watchRegion: string;
  searchText: string;
}) => {
  const { locale } = useLanguage();
  const [showAll, setShowAll] = useState(false);

  const shouldHideByCategory = activeCategory !== "all" && activeCategory !== config.filter;
  const shouldHideByLatest = latestOnly && config.id === "box-office";

  const { data, isLoading } = useGetShowsQuery({
    category: config.category,
    type: config.type,
    page: 1,
    watchProviderId: selectedProviderId,
    watchRegion,
    sortBy:
      sortMode === "rating"
        ? "vote_average.desc"
        : sortMode === "all"
          ? undefined
        : config.id === "recent-movies"
          ? "primary_release_date.desc"
          : config.id === "recent-series"
            ? "first_air_date.desc"
            : "popularity.desc",
  });

  const filteredMovies = useMemo(() => {
    const base = (data?.results || []) as SearchMovie[];
    const scopedBase = config.filter === "anime" ? base.filter(isAnimeTitle) : base;
    const query = searchText.trim().toLowerCase();
    const queried = query
      ? scopedBase.filter((movie) =>
          `${movie.original_title || ""} ${movie.name || ""}`.toLowerCase().includes(query)
        )
      : scopedBase;

    const sorted = sortByMode(queried, sortMode);
    return sorted.slice(0, showAll ? 18 : 6);
  }, [config.filter, data, searchText, showAll, sortMode]);

  if (shouldHideByCategory || shouldHideByLatest) {
    return null;
  }

  return (
    <section className="rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,rgba(31,12,12,0.88),rgba(17,8,8,0.72))] p-5 sm:p-6 lg:p-8 shadow-[0_20px_46px_rgba(0,0,0,0.38)]">
      <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
        <h3 className="text-[30px] sm:text-[40px] tracking-[-0.015em] leading-[1] font-roboto font-semibold text-white">
          {locale === "fr" ? config.titleFr : config.titleEn}
        </h3>
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="shrink-0 rounded-2xl border border-white/15 bg-white/10 px-5 py-2.5 text-white/90 font-semibold hover:bg-white/15 transition-colors duration-200"
        >
          {showAll
            ? locale === "fr"
              ? "Reduire"
              : "Show less"
            : locale === "fr"
              ? "Tout voir"
              : "View all"}
        </button>
      </div>

      {isLoading ? (
        <SkelatonLoader isMoviesSliderLoader={false} />
      ) : filteredMovies.length === 0 ? (
        <p className="text-white/70 text-[16px]">
          {locale === "fr" ? "Aucun resultat pour cette section." : "No results for this section."}
        </p>
      ) : (
        <div className="flex flex-wrap gap-x-4 gap-y-6">
          {filteredMovies.map((movie: SearchMovie) => {
            const date = movie.release_date || movie.first_air_date;
            const dateLabel = date
              ? new Date(date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "";

            return (
              <div key={`${config.id}-${movie.id}`} className="relative flex flex-col gap-2 w-[170px]">
                <span className="absolute z-30 top-10 left-3 rounded-[10px] bg-[#b73636] text-white text-[13px] px-3 py-1 font-semibold">
                  {locale === "fr" ? "Ajout recent" : "New add"}
                </span>
                <MovieCard movie={movie} category={config.category} />
                <p className="text-[#a89b9b] text-[14px] leading-none">
                  {dateLabel || (locale === "fr" ? "Date inconnue" : "Unknown date")}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const Catalogues = () => {
  const { locale } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(() => {
    const initialCategory = searchParams.get("category");
    return initialCategory === "movie" ||
      initialCategory === "tv" ||
      initialCategory === "anime"
      ? initialCategory
      : "all";
  });
  const [sortMode, setSortMode] = useState<SortMode>("all");
  const [latestOnly, setLatestOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [providerFilter, setProviderFilter] = useState<ProviderKey>("all");
  const [providerIds, setProviderIds] = useState<Record<ProviderKey, number | undefined>>({
    all: undefined,
    netflix: undefined,
    prime: undefined,
    apple: undefined,
    disney: undefined,
    max: undefined,
  });

  const watchRegion = locale === "fr" ? "FR" : "US";

  useEffect(() => {
    const fetchProviderIds = async () => {
      try {
        const language = locale === "fr" ? "fr-FR" : "en-US";
        const [movieRes, tvRes] = await Promise.all([
          fetch(
            `${TMDB_API_BASE_URL}/watch/providers/movie?api_key=${API_KEY}&language=${language}&watch_region=${watchRegion}`
          ),
          fetch(
            `${TMDB_API_BASE_URL}/watch/providers/tv?api_key=${API_KEY}&language=${language}&watch_region=${watchRegion}`
          ),
        ]);

        const [movieData, tvData] = await Promise.all([movieRes.json(), tvRes.json()]);
        const merged = [...(movieData?.results || []), ...(tvData?.results || [])] as Array<{
          provider_id: number;
          provider_name: string;
        }>;

        const nextIds: Record<ProviderKey, number | undefined> = {
          all: undefined,
          netflix: undefined,
          prime: undefined,
          apple: undefined,
          disney: undefined,
          max: undefined,
        };

        providerOptions
          .filter((option) => option.key !== "all")
          .forEach((option) => {
            const found = merged.find((provider) =>
              option.aliases.some(
                (alias) => provider.provider_name.toLowerCase() === alias.toLowerCase()
              )
            );
            nextIds[option.key] = found?.provider_id;
          });

        setProviderIds(nextIds);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      }
    };

    fetchProviderIds();
  }, [locale, watchRegion]);

  const selectedProviderId = providerIds[providerFilter];
  const selectedProvider = providerOptions.find((item) => item.key === providerFilter);

  const providerMovieQuery = useGetShowsQuery(
    {
      category: "movie",
      page: 1,
      watchProviderId: selectedProviderId,
      watchRegion,
      sortBy:
        sortMode === "rating"
          ? "vote_average.desc"
          : sortMode === "recent"
            ? "primary_release_date.desc"
            : undefined,
    },
    { skip: !selectedProviderId || activeCategory === "tv" || activeCategory === "anime" }
  );

  const providerTvQuery = useGetShowsQuery(
    {
      category: "tv",
      page: 1,
      watchProviderId: selectedProviderId,
      watchRegion,
      sortBy:
        sortMode === "rating"
          ? "vote_average.desc"
          : sortMode === "recent"
            ? "first_air_date.desc"
            : undefined,
    },
    { skip: !selectedProviderId || activeCategory === "movie" }
  );

  const providerResults = useMemo(() => {
    if (!selectedProviderId) {
      return [];
    }

    const movies = ((providerMovieQuery.data?.results || []) as SearchMovie[]).map((item) => ({
      ...item,
      media_type: "movie" as const,
    }));
    const series = ((providerTvQuery.data?.results || []) as SearchMovie[]).map((item) => ({
      ...item,
      media_type: "tv" as const,
    }));

    const merged = [...movies, ...series];
    const scopedMerged =
      activeCategory === "anime" ? merged.filter((movie) => isAnimeTitle(movie)) : merged;
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return sortByMode(scopedMerged, sortMode).slice(0, 30);
    }

    const searched = scopedMerged.filter((movie) =>
      `${movie.original_title || ""} ${movie.name || ""}`.toLowerCase().includes(query)
    );
    return sortByMode(searched, sortMode).slice(0, 30);
  }, [
    activeCategory,
    providerMovieQuery.data,
    providerTvQuery.data,
    searchText,
    selectedProviderId,
    sortMode,
  ]);

  const animeMovieQuery = useGetShowsQuery(
    {
      category: "movie",
      page: 1,
      withGenres: 16,
      sortBy:
        sortMode === "rating"
          ? "vote_average.desc"
          : sortMode === "recent"
            ? "primary_release_date.desc"
            : "popularity.desc",
    },
    { skip: activeCategory !== "anime" || Boolean(selectedProviderId) || Boolean(searchText) }
  );

  const animeTvQuery = useGetShowsQuery(
    {
      category: "tv",
      page: 1,
      withGenres: 16,
      sortBy:
        sortMode === "rating"
          ? "vote_average.desc"
          : sortMode === "recent"
            ? "first_air_date.desc"
            : "popularity.desc",
    },
    { skip: activeCategory !== "anime" || Boolean(selectedProviderId) || Boolean(searchText) }
  );

  const animeAllResults = useMemo(() => {
    if (activeCategory !== "anime" || selectedProviderId || searchText) {
      return [];
    }

    const movies = ((animeMovieQuery.data?.results || []) as SearchMovie[]).map((item) => ({
      ...item,
      media_type: "movie" as const,
    }));
    const series = ((animeTvQuery.data?.results || []) as SearchMovie[]).map((item) => ({
      ...item,
      media_type: "tv" as const,
    }));

    return sortByMode([...movies, ...series], sortMode).slice(0, 30);
  }, [
    activeCategory,
    animeMovieQuery.data,
    animeTvQuery.data,
    searchText,
    selectedProviderId,
    sortMode,
  ]);

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchText(searchInput.trim());
  };

  useEffect(() => {
    const category = searchParams.get("category");
    const nextCategory: CategoryFilter =
      category === "movie" || category === "tv" || category === "anime"
        ? category
        : "all";

    if (nextCategory !== activeCategory) {
      setActiveCategory(nextCategory);
    }
  }, [activeCategory, searchParams]);

  const updateCategory = (next: CategoryFilter) => {
    setActiveCategory(next);
    const nextParams = new URLSearchParams(searchParams);
    if (next === "all") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", next);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const isSearchActive = searchText.length > 0;

  const movieSearch = useGetShowsQuery(
    { category: "movie", page: 1, searchQuery: searchText },
    { skip: !isSearchActive || activeCategory === "tv" || activeCategory === "anime" }
  );

  const tvSearch = useGetShowsQuery(
    { category: "tv", page: 1, searchQuery: searchText },
    { skip: !isSearchActive || activeCategory === "movie" }
  );

  const searchResults = useMemo(() => {
    if (!isSearchActive) {
      return [];
    }

    const movies = ((movieSearch.data?.results || []) as SearchMovie[]).map((item) => ({
      ...item,
      media_type: "movie" as const,
    }));
    const series = ((tvSearch.data?.results || []) as SearchMovie[]).map((item) => ({
      ...item,
      media_type: "tv" as const,
    }));

    const merged = [...movies, ...series];
    const scoped = activeCategory === "anime" ? merged.filter((movie) => isAnimeTitle(movie)) : merged;
    return sortByMode(scoped, sortMode).slice(0, 24);
  }, [activeCategory, isSearchActive, movieSearch.data, tvSearch.data, sortMode]);

  const movieRankingQuery = useGetShowsQuery(
    { category: "movie", page: 1, sortBy: "vote_count.desc" },
    { skip: activeCategory !== "movie" || isSearchActive || Boolean(selectedProviderId) }
  );

  const tvRankingQuery = useGetShowsQuery(
    { category: "tv", page: 1, sortBy: "vote_count.desc" },
    { skip: activeCategory !== "tv" || isSearchActive || Boolean(selectedProviderId) }
  );

  const animeMovieRankingQuery = useGetShowsQuery(
    { category: "movie", page: 1, withGenres: 16, sortBy: "vote_count.desc" },
    { skip: activeCategory !== "anime" || isSearchActive || Boolean(selectedProviderId) }
  );

  const animeTvRankingQuery = useGetShowsQuery(
    { category: "tv", page: 1, withGenres: 16, sortBy: "vote_count.desc" },
    { skip: activeCategory !== "anime" || isSearchActive || Boolean(selectedProviderId) }
  );

  const categoryRankingItems = useMemo(() => {
    if (activeCategory === "movie") {
      return ((movieRankingQuery.data?.results || []) as SearchMovie[])
        .filter((item) => !!item.poster_path)
        .slice(0, 10);
    }

    if (activeCategory === "tv") {
      return ((tvRankingQuery.data?.results || []) as SearchMovie[])
        .filter((item) => !!item.poster_path)
        .slice(0, 10);
    }

    if (activeCategory === "anime") {
      const animeMovies = ((animeMovieRankingQuery.data?.results || []) as SearchMovie[]).map((item) => ({
        ...item,
        media_type: "movie" as const,
      }));
      const animeSeries = ((animeTvRankingQuery.data?.results || []) as SearchMovie[]).map((item) => ({
        ...item,
        media_type: "tv" as const,
      }));

      return [...animeMovies, ...animeSeries]
        .filter((item) => !!item.poster_path)
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 10);
    }

    return [];
  }, [
    activeCategory,
    animeMovieRankingQuery.data,
    animeTvRankingQuery.data,
    movieRankingQuery.data,
    tvRankingQuery.data,
  ]);

  const showCategoryRanking = activeCategory !== "all" && !isSearchActive && !selectedProviderId;
  const categoryRankingLoading =
    (activeCategory === "movie" && (movieRankingQuery.isLoading || movieRankingQuery.isFetching)) ||
    (activeCategory === "tv" && (tvRankingQuery.isLoading || tvRankingQuery.isFetching)) ||
    (activeCategory === "anime" &&
      (animeMovieRankingQuery.isLoading ||
        animeMovieRankingQuery.isFetching ||
        animeTvRankingQuery.isLoading ||
        animeTvRankingQuery.isFetching));

  const categoryRankingTitle =
    locale === "fr"
      ? activeCategory === "movie"
        ? "Classement Films - Les plus vus (global)"
        : activeCategory === "tv"
          ? "Classement Series - Les plus vues (global)"
          : "Classement Animes - Les plus vus (global)"
      : activeCategory === "movie"
        ? "Movie ranking - Most viewed (global)"
        : activeCategory === "tv"
          ? "Series ranking - Most viewed (global)"
          : "Anime ranking - Most viewed (global)";

  return (
    <div className="pt-[86px] pb-14">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(149,20,20,0.38),transparent_42%),radial-gradient(circle_at_10%_100%,rgba(98,14,14,0.3),transparent_36%)]" />
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(125deg,transparent_0%,transparent_30%,rgba(215,67,67,0.16)_30%,rgba(215,67,67,0.16)_34%,transparent_34%,transparent_100%)] bg-[length:280px_280px]" />

        <div className={cn(maxWidth, "relative z-10 py-16 sm:py-20 lg:py-24")}>
          <h1 className="text-center text-white font-roboto text-[40px] sm:text-[56px] lg:text-[72px] leading-[0.95] tracking-[-0.02em]">
            {locale === "fr" ? "Que souhaites-tu regarder ?" : "What do you want to watch?"}
          </h1>
          <p className="text-center text-[#d85a5a] text-[18px] mt-3">
            {locale === "fr"
              ? "Des milliers de references n attendent qu a etre visionnees"
              : "Thousands of titles are waiting for your next session"}
          </p>

          <form
            onSubmit={runSearch}
            className="mx-auto mt-8 max-w-[980px] rounded-[22px] border border-white/12 bg-white/[0.08] px-5 sm:px-6 py-4 flex items-center gap-4 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
          >
            <GoSearch className="text-[28px] text-white/70" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent outline-none text-white text-[19px] placeholder:text-[#b7a4a4]"
              placeholder={
                locale === "fr"
                  ? "Rechercher un film, une serie, un anime, un acteur..."
                  : "Search a movie, tv show, anime, actor..."
              }
            />
            <button
              type="submit"
              className="rounded-xl bg-white/10 hover:bg-white/15 text-white px-4 py-2 text-sm font-semibold transition-colors"
            >
              {locale === "fr" ? "Chercher" : "Search"}
            </button>
          </form>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="rounded-2xl border border-white/12 bg-white/[0.08] text-white px-5 py-3 inline-flex items-center gap-2 font-semibold"
            >
              <FiFilter />
              {locale === "fr" ? "Filtrer" : "Filter"}
            </button>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <button
                type="button"
                className={cn(
                  "rounded-2xl px-5 py-3 font-semibold transition-colors",
                  activeCategory === "all"
                    ? "bg-white/12 text-white"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
                onClick={() => updateCategory("all")}
              >
                {locale === "fr" ? "Accueil" : "Home"}
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-2xl px-5 py-3 transition-colors",
                  activeCategory === "movie"
                    ? "bg-white/12 text-white font-semibold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
                onClick={() => updateCategory("movie")}
              >
                {locale === "fr" ? "Tous les Films" : "All Movies"}
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-2xl px-5 py-3 transition-colors",
                  activeCategory === "tv"
                    ? "bg-white/12 text-white font-semibold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
                onClick={() => updateCategory("tv")}
              >
                {locale === "fr" ? "Toutes les Series" : "All Series"}
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-2xl px-5 py-3 transition-colors",
                  activeCategory === "anime"
                    ? "bg-white/12 text-white font-semibold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
                onClick={() => updateCategory("anime")}
              >
                {locale === "fr" ? "Tous les Animes" : "All Anime"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setLatestOnly((prev) => !prev)}
              className={cn(
                "rounded-2xl border px-5 py-3 font-semibold transition-colors",
                latestOnly
                  ? "border-red-300/40 bg-red-500/25 text-white"
                  : "border-white/12 bg-white/[0.08] text-white"
              )}
            >
              {locale === "fr" ? "Derniers ajouts" : "Latest adds"}
            </button>
          </div>

          {showFilters ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 flex flex-wrap items-center gap-3">
              <span className="text-white/85 font-semibold text-sm">
                {locale === "fr" ? "Tri:" : "Sort:"}
              </span>
              <button
                type="button"
                onClick={() => setSortMode("all")}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm border transition-colors",
                  sortMode === "all"
                    ? "border-red-300/45 bg-red-500/20 text-white"
                    : "border-white/12 text-white/85"
                )}
              >
                {locale === "fr" ? "Tout" : "All"}
              </button>
              <button
                type="button"
                onClick={() => setSortMode("recent")}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm border transition-colors",
                  sortMode === "recent"
                    ? "border-red-300/45 bg-red-500/20 text-white"
                    : "border-white/12 text-white/85"
                )}
              >
                {locale === "fr" ? "Recents" : "Recent"}
              </button>
              <button
                type="button"
                onClick={() => setSortMode("rating")}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm border transition-colors",
                  sortMode === "rating"
                    ? "border-red-300/45 bg-red-500/20 text-white"
                    : "border-white/12 text-white/85"
                )}
              >
                {locale === "fr" ? "Mieux notes" : "Top rated"}
              </button>

              <span className="ml-2 text-white/85 font-semibold text-sm inline-flex items-center gap-1">
                <TbDeviceTv />
                {locale === "fr" ? "Provider:" : "Provider:"}
              </span>
              {providerOptions.map((provider) => (
                <button
                  key={provider.key}
                  type="button"
                  onClick={() => setProviderFilter(provider.key)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm border transition-colors",
                    providerFilter === provider.key
                      ? "border-red-300/45 bg-red-500/20 text-white"
                      : "border-white/12 text-white/85"
                  )}
                >
                  {locale === "fr" ? provider.labelFr : provider.labelEn}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className={cn(maxWidth, "mt-8 flex flex-col gap-8")}>
        {showCategoryRanking ? (
          <CategoryRanking
            title={categoryRankingTitle}
            items={categoryRankingItems}
            loading={categoryRankingLoading}
          />
        ) : null}

        <div className="rounded-[18px] border border-red-300/20 bg-[linear-gradient(90deg,rgba(67,17,17,0.75),rgba(108,15,15,0.68))] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[#f6dede] text-[30px] leading-[1] font-roboto font-semibold">
              {locale === "fr" ? "Tu ne trouves pas ton film / ta serie ?" : "Missing a movie or tv show?"}
            </p>
            <p className="text-white/80 mt-2 text-[18px]">
              {locale === "fr" ? "Active une recherche pour proposer des references precises" : "Use search to request precise titles"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowFilters(true);
              setLatestOnly(true);
            }}
            className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-white font-semibold hover:bg-white/15 transition-colors"
          >
            {locale === "fr" ? "Demande d ajout" : "Submit request"}
          </button>
        </div>

        {selectedProviderId ? (
          <section className="rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,rgba(31,12,12,0.88),rgba(17,8,8,0.72))] p-5 sm:p-6 lg:p-8 shadow-[0_20px_46px_rgba(0,0,0,0.38)]">
            <h3 className="text-[30px] sm:text-[40px] tracking-[-0.015em] leading-[1] font-roboto font-semibold text-white mb-6">
              {locale === "fr"
                ? `Catalogue ${selectedProvider?.labelFr || "Provider"}`
                : `${selectedProvider?.labelEn || "Provider"} catalogue`}
            </h3>
            {providerMovieQuery.isFetching || providerTvQuery.isFetching ? (
              <SkelatonLoader isMoviesSliderLoader={false} />
            ) : providerResults.length === 0 ? (
              <p className="text-white/70 text-[16px]">
                {locale === "fr" ? "Aucun resultat pour ce provider." : "No results for this provider."}
              </p>
            ) : (
              <div className="flex flex-wrap gap-x-4 gap-y-6">
                {providerResults.map((movie) => (
                  <div key={`provider-${movie.media_type}-${movie.id}`} className="relative flex flex-col gap-2 w-[170px]">
                    <MovieCard movie={movie} category={movie.media_type === "tv" ? "tv" : "movie"} />
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : activeCategory === "anime" && !isSearchActive ? (
          <section className="rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,rgba(31,12,12,0.88),rgba(17,8,8,0.72))] p-5 sm:p-6 lg:p-8 shadow-[0_20px_46px_rgba(0,0,0,0.38)]">
            <h3 className="text-[30px] sm:text-[40px] tracking-[-0.015em] leading-[1] font-roboto font-semibold text-white mb-6">
              {locale === "fr" ? "Tous les Animes" : "All Anime"}
            </h3>
            {animeMovieQuery.isFetching || animeTvQuery.isFetching ? (
              <SkelatonLoader isMoviesSliderLoader={false} />
            ) : animeAllResults.length === 0 ? (
              <p className="text-white/70 text-[16px]">
                {locale === "fr" ? "Aucun anime trouve." : "No anime found."}
              </p>
            ) : (
              <div className="flex flex-wrap gap-x-4 gap-y-6">
                {animeAllResults.map((movie) => (
                  <div key={`anime-all-${movie.media_type}-${movie.id}`} className="relative flex flex-col gap-2 w-[170px]">
                    <MovieCard movie={movie} category={movie.media_type === "tv" ? "tv" : "movie"} />
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : isSearchActive ? (
          <section className="rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,rgba(31,12,12,0.88),rgba(17,8,8,0.72))] p-5 sm:p-6 lg:p-8 shadow-[0_20px_46px_rgba(0,0,0,0.38)]">
            <h3 className="text-[30px] sm:text-[40px] tracking-[-0.015em] leading-[1] font-roboto font-semibold text-white mb-6">
              {locale === "fr" ? `Resultats pour "${searchText}"` : `Results for "${searchText}"`}
            </h3>
            {movieSearch.isFetching || tvSearch.isFetching ? (
              <SkelatonLoader isMoviesSliderLoader={false} />
            ) : searchResults.length === 0 ? (
              <p className="text-white/70 text-[16px]">
                {locale === "fr" ? "Aucun resultat trouve." : "No results found."}
              </p>
            ) : (
              <div className="flex flex-wrap gap-x-4 gap-y-6">
                {searchResults.map((movie) => (
                  <div key={`search-${movie.media_type}-${movie.id}`} className="relative flex flex-col gap-2 w-[170px]">
                    <MovieCard movie={movie} category={movie.media_type === "tv" ? "tv" : "movie"} />
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          shelfConfigs.map((config) => (
            <CatalogShelf
              key={config.id}
              config={config}
              activeCategory={activeCategory}
              latestOnly={latestOnly}
              sortMode={sortMode}
              selectedProviderId={selectedProviderId}
              watchRegion={watchRegion}
              searchText={searchText}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default Catalogues;
