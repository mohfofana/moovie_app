import { memo, FC } from "react";
import { Link } from "react-router-dom";

import MoviesSlides from "../Section/MoviesSlides";
import { useTheme } from "@/context/themeContext";
import { useLanguage } from "@/context/languageContext";
import { cn } from "@/utils/helper";
import { IMovie } from "@/types";

interface PersonalSectionProps {
  title: string;
  movies: IMovie[];
  viewAllLink?: string;
  className?: string;
}

const PersonalSection: FC<PersonalSectionProps> = ({
  title,
  movies,
  viewAllLink,
  className,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  if (!movies || movies.length === 0) {
    return null;
  }

  const sectionStyle = cn(`sm:py-10 xs:py-9 py-8 font-nunito`, className);
  const linkStyle = cn(
    `group sm:py-2 py-1.5 sm:text-[13px] xs:text-[12.5px] text-[12px] tracking-tight font-medium sm:px-5 px-4 rounded-full dark:text-gray-300 text-gray-700 transition-all duration-200`,
    theme === "Dark" ? "view-all-btn--dark" : "view-all-btn--light"
  );

  return (
    <section className={sectionStyle}>
      <div className="flex flex-row justify-between items-center mb-6">
        <h3 className="font-roboto sm:text-[32px] xs:text-[28px] text-[24px] tracking-tight text-gray-900 dark:text-white font-semibold">
          {title}
        </h3>
        {viewAllLink && (
          <Link to={viewAllLink} className={linkStyle}>
            {t.common.seeAll}
          </Link>
        )}
      </div>
      <div className="sm:h-[312px] xs:h-[309px] h-[266px]">
        <MoviesSlides movies={movies.slice(0, 10)} category="movie" />
      </div>
    </section>
  );
};

export default memo(PersonalSection);
