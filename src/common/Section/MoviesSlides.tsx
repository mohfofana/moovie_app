import { FC, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import MovieCard from "../MovieCard";
import { IMovie } from "@/types";

interface MoviesSlidesProps {
  movies: IMovie[];
  category: string;
}

const MoviesSlides: FC<MoviesSlidesProps> = ({ movies, category }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pushOffset = 170; // expanded width (340) - base width (170)

  return (
    <Swiper slidesPerView="auto" spaceBetween={15} className="mySwiper !overflow-visible">
      {movies.map((movie, index) => {
        const shouldShift = hoveredIndex !== null && index > hoveredIndex;
        const isHovered = hoveredIndex === index;

        return (
          <SwiperSlide
            key={movie.id}
            className="flex mt-1 flex-col xs:gap-[14px] gap-2 !overflow-visible rounded-lg !w-[170px]"
            style={{
              transform: shouldShift ? `translateX(${pushOffset}px)` : "translateX(0px)",
              transition: "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
              zIndex: isHovered ? 40 : 10,
            }}
          >
            <MovieCard
              movie={movie}
              category={category}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex((prev) => (prev === index ? null : prev))}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default MoviesSlides;
