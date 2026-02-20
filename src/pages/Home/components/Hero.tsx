import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";

import HeroSlide from "./HeroSlide";
import { IMovie } from "@/types";

const Hero = ({ movies }: { movies: IMovie[] }) => (
  <Swiper
    className="mySwiper lg:h-screen sm:h-[700px] xs:h-[560px] h-[500px] w-full"
    loop={true}
    slidesPerView={1}
    autoplay={{
      delay: 10000,
      disableOnInteraction: false,
    }}
    modules={[Autoplay]}
  >
    {movies.map((movie) => {
      return (
        <SwiperSlide
          key={movie.id}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8)),
              linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.6)),
              url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className="h-full w-full"
        >
          {({ isActive }) => (isActive ? <HeroSlide movie={movie} /> : null)}
        </SwiperSlide>
      );
    })}
  </Swiper>
);

export default Hero;
