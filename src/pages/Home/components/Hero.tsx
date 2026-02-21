import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";

import HeroSlide from "./HeroSlide";
import { IMovie } from "@/types";

interface MovieWithVideos extends IMovie {
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

const Hero = ({ movies }: { movies: MovieWithVideos[] }) => {
  return (
    <Swiper
      className="mySwiper lg:h-[860px] sm:h-[760px] xs:h-[680px] h-[620px] w-full"
      loop={true}
      slidesPerView={1}
      autoplay={{
        delay: 15000,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
    >
      {movies.map((movie) => {
        return (
          <SwiperSlide key={movie.id} className="h-full w-full relative">
            {({ isActive }) => (isActive ? <HeroSlide movie={movie} /> : null)}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Hero;
