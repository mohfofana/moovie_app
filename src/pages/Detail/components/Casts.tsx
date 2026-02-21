import { memo, FC } from 'react';
import { m } from 'framer-motion';
import { useMediaQuery } from 'usehooks-ts';

import Image from '@/common/Image';
import { useMotion } from '@/hooks/useMotion';

interface CastsProps {
  casts: {
    id: string | number;
    profile_path: string;
    name: string;
  }[];
}

const Casts: FC<CastsProps> = ({ casts }) => {
  const isNotMobile = useMediaQuery('(min-width: 768px)');
  const { fadeDown, staggerContainer } = useMotion();
  const topCasts = casts.slice(0, 6);

  if (topCasts.length === 0) return null;

  return (
    <>
      <m.h3
        variants={fadeDown}
        className="text-white font-semibold md:text-[18px] sm:text-[16px] text-[15px]"
      >
        Casting principal
      </m.h3>
      <m.div
        variants={staggerContainer(0.2, 0.18)}
        initial="hidden"
        animate="show"
        className="flex flex-wrap md:gap-4 gap-3"
      >
        {topCasts.map((cast) => {
          const { id, profile_path: profilePath, name } = cast;
          return (
            <m.figure
              variants={fadeDown}
              key={String(id)}
              className="flex flex-col justify-start gap-2"
            >
              <div className="md:h-[98px] md:w-[70px] h-[58px] w-[44px] rounded-lg overflow-hidden border border-white/15">
                <Image
                  width={isNotMobile ? 70 : 44}
                  height={isNotMobile ? 98 : 58}
                  src={`https://image.tmdb.org/t/p/original/${profilePath}`}
                  alt={name}
                  className="object-cover"
                />
              </div>

              <h4 className="text-gray-200 text-[10px] md:max-w-[70px] text-center font-medium leading-snug max-w-[44px]">
                {name}
              </h4>
            </m.figure>
          );
        })}
      </m.div>
    </>
  );
};

export default memo(Casts, (prevProps, newProps) => {
  return prevProps.casts[0]?.id === newProps.casts[0]?.id;
});
