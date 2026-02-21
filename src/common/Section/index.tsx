import { memo, FC, useRef } from "react";
import { Link } from "react-router-dom";
import { useInView } from "framer-motion";

import MoviesSlides from "./MoviesSlides";
import { SkelatonLoader } from "../Loader";
import Error from "../Error";

import { useGetShowsQuery } from "@/services/TMDB";
import { useTheme } from "@/context/themeContext";
import { useLanguage } from "@/context/languageContext";
import { cn, getErrorMessage } from "@/utils/helper";

interface SectionProps {
  title: string;
  category: string;
  className?: string;
  type?: string;
  id?: number;
  showSimilarShows?: boolean;
}

const Section: FC<SectionProps> = ({
  title,
  category,
  className,
  type,
  id,
  showSimilarShows,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    margin: "420px",
    once: true,
  });

  const { theme } = useTheme();
  const { t } = useLanguage();

  const {
    data = { results: [] },
    isLoading,
    isError,
    error,
  } = useGetShowsQuery(
    {
      category,
      type,
      page: 1,
      showSimilarShows,
      id,
    },
    {
      skip: !inView,
    }
  );

  const errorMessage = isError ? getErrorMessage(error) : "";

  const sectionStyle = cn(
    `sm:py-10 xs:py-9 py-8 font-nunito`,
    className
  );
  const linkStyle = cn(
    `group sm:py-2 py-1.5 sm:text-[13px] xs:text-[12.5px] text-[12px] tracking-tight font-medium sm:px-5 px-4 rounded-full dark:text-gray-300 text-gray-700 transition-all duration-200`,
    theme === "Dark" ? "view-all-btn--dark" : "view-all-btn--light"
  );

  return (
    <section className={sectionStyle} ref={ref}>
      <div className="flex flex-row justify-between items-center mb-6">
        <div>
          <span className="text-[#d95d5d] text-sm">Top contenu</span>
          <h3 className="font-roboto sm:text-[38px] xs:text-[32px] text-[26px] tracking-tight text-gray-100 font-semibold">
            {title}
          </h3>
        </div>
        {!showSimilarShows && (
          <Link to={`/${category}?type=${type}`} className={linkStyle}>
            {t.common.seeAll}
          </Link>
        )}
      </div>
      <div className="sm:h-[365px] xs:h-[360px] h-[315px]">
        {isLoading ? (
          <SkelatonLoader />
        ) : isError ? (
          <Error error={String(errorMessage)} className="h-full text-[18px]" />
        ) : (
          <MoviesSlides
            movies={data.results.slice(0, 10)}
            category={category}
          />
        )}
      </div>
    </section>
  );
};

export default memo(Section);
