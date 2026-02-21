import { Link } from "react-router-dom";

import { VideoBackground } from "@/common";
import { useLanguage } from "@/context/languageContext";
import { maxWidth } from "@/styles";
import { cn } from "@/utils/helper";

interface WeeklySpotlightItem {
  id: string;
  mediaType: "movie" | "tv";
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genres?: Array<{ id: number; name: string }>;
  runtime?: number;
  episode_run_time?: number[];
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

interface WeeklySpotlightProps {
  item: WeeklySpotlightItem;
  weekNumber: number;
}

const WeeklySpotlight = ({ item, weekNumber }: WeeklySpotlightProps) => {
  const { locale } = useLanguage();
  const isFrench = locale === "fr";
  const title = item.title || item.name || "";
  const categoryPath = item.mediaType === "movie" ? "movie" : "tv";
  const releaseYear = (item.release_date || item.first_air_date || "").slice(0, 4);
  const genres = item.genres?.slice(0, 3).map((genre) => genre.name) || [];
  const sourceLabel =
    item.mediaType === "movie"
      ? isFrench
        ? "Box-office de la semaine"
        : "Weekly box-office picks"
      : isFrench
        ? "Selection streaming de la semaine"
        : "Weekly streaming picks";

  const videoKey =
    item.videos?.results?.find(
      (video) => video.site?.toLowerCase() === "youtube" && video.type === "Trailer"
    )?.key ||
    item.videos?.results?.find((video) => video.site?.toLowerCase() === "youtube")?.key;

  const runtimeMinutes =
    item.mediaType === "movie"
      ? item.runtime
      : item.episode_run_time && item.episode_run_time.length > 0
        ? item.episode_run_time[0]
        : undefined;

  const runtimeLabel = runtimeMinutes
    ? `${Math.floor(runtimeMinutes / 60)}h${String(runtimeMinutes % 60).padStart(2, "0")}`
    : "";

  const summary =
    item.overview && item.overview.length > 260
      ? `${item.overview.slice(0, 260)}...`
      : item.overview;

  return (
    <section className="lg:mt-10 sm:mt-8 mt-6">
      <div className={cn(maxWidth)}>
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 min-h-[520px] sm:min-h-[560px] shadow-[0_28px_70px_rgba(0,0,0,0.55)]">
          <VideoBackground videoKey={videoKey} backdropPath={item.backdrop_path} overlayTone="light" />

          <div className="absolute inset-0 z-20 bg-gradient-to-r from-[rgba(11,5,5,0.6)] via-[rgba(11,5,5,0.24)] to-[rgba(11,5,5,0.56)]" />
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-transparent to-[rgba(8,4,4,0.66)]" />

          <div className="relative z-30 p-6 sm:p-8 lg:p-12 flex items-end min-h-[520px] sm:min-h-[560px]">
            <div className="max-w-[720px]">
              <span className="inline-flex items-center rounded-xl px-4 py-2 bg-[rgba(218,72,72,0.2)] border border-[rgba(255,120,120,0.4)] text-white text-xs sm:text-sm font-semibold">
                {isFrench ? "Top de la semaine" : "Weekly spotlight"} - {sourceLabel}
              </span>

              <h2 className="mt-4 text-white text-[38px] sm:text-[52px] lg:text-[70px] leading-[0.95] tracking-[-0.02em] font-roboto font-semibold text-shadow">
                {title}
              </h2>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-white/95 text-sm sm:text-base">
                {item.vote_average ? (
                  <span className="px-3 py-1 rounded-xl border border-white/60">
                    * {item.vote_average.toFixed(1)}/10
                  </span>
                ) : null}
                {genres.map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
                {releaseYear ? <span>{releaseYear}</span> : null}
                {runtimeLabel ? <span>{runtimeLabel}</span> : null}
                <span className="px-3 py-1 rounded-xl border border-white/40 text-xs sm:text-sm uppercase tracking-[0.08em]">
                  Semaine {weekNumber}
                </span>
              </div>

              <p className="mt-5 text-[#f2e9e9] text-[16px] sm:text-[18px] leading-[1.55] max-w-[90%]">
                {summary}
              </p>

              <div className="mt-7">
                <Link
                  to={`/${categoryPath}/${item.id}`}
                  className="inline-flex items-center justify-center px-7 py-3 rounded-2xl bg-white text-black hover:bg-white/90 font-semibold text-[16px] transition-colors duration-200"
                >
                  {isFrench ? "Voir la fiche" : "Open details"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklySpotlight;
