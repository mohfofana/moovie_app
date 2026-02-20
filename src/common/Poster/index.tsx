import { memo } from "react";
import { m } from "framer-motion";

import Image from "../Image";
import { cn } from "@/utils/helper";
import { useMotion } from "@/hooks/useMotion";

interface PosterPropsType {
  posterPath: string;
  title: string;
  className?: string;
}

const Poster = ({ posterPath, title, className }: PosterPropsType) => {
  const { zoomIn } = useMotion();
  return (
    <div className={cn(`md:block hidden`, className)}>
      <m.div
        variants={zoomIn(0.6, 0.8)}
        initial="hidden"
        animate="show"
        className="h-[400px] w-[267px] relative group"
      >
        <div className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-2xl" />
        <Image
          width={267}
          height={400}
          src={`https://image.tmdb.org/t/p/original/${posterPath}`}
          alt={title}
          className="object-cover rounded-2xl shadow-card border border-white/10 relative z-10 group-hover:scale-[1.02] transition-transform duration-500"
        />
      </m.div>
    </div>
  );
};

export default memo(Poster);
