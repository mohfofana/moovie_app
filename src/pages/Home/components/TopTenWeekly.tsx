import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import { SkelatonLoader } from "@/common";
import Image from "@/common/Image";
import { useLanguage } from "@/context/languageContext";
import { useGetShowsQuery } from "@/services/TMDB";
import type { IMovie } from "@/types";

type MediaType = "movie" | "tv";

type TopItem = IMovie & {
  mediaType: MediaType;
  popularity?: number;
};

type Provider = {
  id: number;
  labelFr: string;
  labelEn: string;
};

type TopTenWeeklyProps = {
  mediaType: MediaType;
};

const providers: Provider[] = [
  { id: 8, labelFr: "Netflix", labelEn: "Netflix" },
  { id: 119, labelFr: "Prime Video", labelEn: "Prime Video" },
  { id: 350, labelFr: "Apple TV+", labelEn: "Apple TV+" },
];

const getIsoWeekNumber = (date: Date) => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const TopTenWeekly = ({ mediaType }: TopTenWeeklyProps) => {
  const { locale } = useLanguage();
  const watchRegion = locale === "fr" ? "FR" : "US";
  const week = getIsoWeekNumber(new Date());
  const provider = providers[(week - 1) % providers.length];

  const showsQuery = useGetShowsQuery({
    category: mediaType,
    page: 1,
    watchProviderId: provider.id,
    watchRegion,
    sortBy: "popularity.desc",
  });

  const loading = showsQuery.isLoading || showsQuery.isFetching;

  const items = useMemo(() => {
    return ((showsQuery.data?.results || []) as IMovie[])
      .map((item) => ({
      ...item,
      mediaType,
    }))
      .filter((item) => !!item.poster_path)
      .sort(
        (a, b) =>
          ((b as TopItem).popularity || 0) - ((a as TopItem).popularity || 0)
      )
      .slice(0, 10);
  }, [showsQuery.data, mediaType]);

  const sectionLabel =
    locale === "fr"
      ? mediaType === "movie"
        ? "Top 10 films"
        : "Top 10 series"
      : mediaType === "movie"
      ? "Top 10 movies"
      : "Top 10 series";

  return (
    <section className="sm:py-6 py-4">
      <h3 className="font-roboto sm:text-[28px] text-[22px] tracking-tight text-white font-semibold mb-2">
        {locale === "fr"
          ? `${sectionLabel} ${provider.labelFr} - Semaine ${week}`
          : `${sectionLabel} ${provider.labelEn} - Week ${week}`}
      </h3>
      <p className="text-white/60 text-[14px] mb-4">
        {locale === "fr"
          ? "Rotation automatique chaque semaine: Netflix, Prime Video, Apple TV+"
          : "Weekly auto-rotation: Netflix, Prime Video, Apple TV+"}
      </p>

      {loading ? (
        <SkelatonLoader />
      ) : (
        <Swiper slidesPerView="auto" spaceBetween={24} className="!overflow-visible">
          {items.map((item, index) => {
            const title = item.original_title || item.name;
            const num = index + 1;
            const isDouble = num === 10;

            return (
              <SwiperSlide
                key={`${item.mediaType}-${item.id}`}
                style={{ width: isDouble ? "286px" : "262px" }}
              >
                <Link
                  to={`/${item.mediaType}/${item.id}`}
                  className="relative flex items-end group select-none h-[286px]"
                >
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

export default TopTenWeekly;
