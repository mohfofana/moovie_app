import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import { SkelatonLoader } from "@/common";
import Image from "@/common/Image";
import { useLanguage } from "@/context/languageContext";
import { useGetShowsQuery } from "@/services/TMDB";
import type { IMovie } from "@/types";

type TopRailProps = {
  titleFr: string;
  titleEn: string;
  category: "movie" | "tv";
  list: IMovie[];
  loading: boolean;
};

const TopRail = ({ titleFr, titleEn, category, list, loading }: TopRailProps) => {
  const { locale } = useLanguage();

  return (
    <section className="sm:py-6 py-4">
      <h3 className="font-roboto sm:text-[28px] text-[22px] tracking-tight text-white font-semibold mb-4">
        {locale === "fr" ? titleFr : titleEn}
      </h3>

      {loading ? (
        <SkelatonLoader />
      ) : (
        <Swiper slidesPerView="auto" spaceBetween={24} className="!overflow-visible">
          {list.slice(0, 10).map((item, index) => {
            const title = item.original_title || item.name;
            const num = index + 1;
            const isDouble = num === 10;
            return (
              <SwiperSlide
                key={`${category}-${item.id}`}
                style={{ width: isDouble ? "286px" : "262px" }}
              >
                <Link
                  to={`/${category}/${item.id}`}
                  className="relative flex items-end group select-none h-[286px]"
                >
                  {/* Number */}
                  <span
                    className="font-roboto font-black italic leading-[0.8] select-none pointer-events-none absolute bottom-0 left-0 z-0"
                    style={{
                      fontSize: isDouble ? "202px" : "232px",
                      left: isDouble ? "-22px" : "-16px",
                      color: "transparent",
                      WebkitTextStroke: "3px rgba(255,255,255,0.22)",
                      paintOrder: "stroke fill",
                    }}
                  >
                    {num}
                  </span>

                  {/* Poster */}
                  <div
                    className="relative z-10 transition-all duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1"
                    style={{ marginLeft: isDouble ? "96px" : "78px" }}
                  >
                    <div className="w-[170px] h-[250px] rounded-[12px] overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.55)] group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.75)]">
                      <Image
                        height={250}
                        width={170}
                        src={`https://image.tmdb.org/t/p/w342/${item.poster_path}`}
                        alt={title}
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
      )}
    </section>
  );
};

const TopTenWeekly = () => {
  const moviesQuery = useGetShowsQuery({ category: "movie", type: "popular", page: 1 });
  const seriesQuery = useGetShowsQuery({ category: "tv", type: "popular", page: 1 });
  const animeQuery = useGetShowsQuery({
    category: "tv",
    withGenres: 16,
    sortBy: "popularity.desc",
    page: 1,
  });

  const movies = useMemo(() => (moviesQuery.data?.results || []) as IMovie[], [moviesQuery.data]);
  const series = useMemo(() => (seriesQuery.data?.results || []) as IMovie[], [seriesQuery.data]);
  const anime = useMemo(() => (animeQuery.data?.results || []) as IMovie[], [animeQuery.data]);

  return (
    <div className="mt-2">
      <TopRail
        titleFr="Top 10 des films cette semaine"
        titleEn="Top 10 movies this week"
        category="movie"
        list={movies}
        loading={moviesQuery.isLoading || moviesQuery.isFetching}
      />
      <TopRail
        titleFr="Top 10 des séries cette semaine"
        titleEn="Top 10 series this week"
        category="tv"
        list={series}
        loading={seriesQuery.isLoading || seriesQuery.isFetching}
      />
      <TopRail
        titleFr="Top 10 des animes cette semaine"
        titleEn="Top 10 anime this week"
        category="tv"
        list={anime}
        loading={animeQuery.isLoading || animeQuery.isFetching}
      />
    </div>
  );
};

export default TopTenWeekly;
