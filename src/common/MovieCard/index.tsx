import { Link } from 'react-router-dom';
import { FaYoutube } from 'react-icons/fa';

import Image from '../Image';
import { IMovie } from '@/types';
import { useMediaQuery } from 'usehooks-ts';

const MovieCard = ({
  movie,
  category,
}: {
  movie: IMovie;
  category: string;
}) => {
  const { poster_path, original_title: title, name, id, vote_average } = movie;
  const inferredType = category === 'tv' ? 'Serie' : 'Film';
  const isMobile = useMediaQuery('(max-width: 380px)');

  return (
    <div className="flex flex-col gap-2.5 w-[170px]">
      <Link
        to={`/${category}/${id}`}
        className="rounded-[12px] relative group w-[170px] select-none xs:h-[250px] h-[216px] overflow-hidden border border-white/10 bg-[#130909] card-3d"
      >
        <Image
          height={!isMobile ? 250 : 216}
          width={170}
          src={`https://image.tmdb.org/t/p/original/${poster_path}`}
          alt={movie.original_title}
          className="object-cover rounded-[12px] group-hover:scale-[1.03] transition-all duration-350 ease-out"
          effect="zoomIn"
        />

        <div className="absolute top-2 left-2 bg-black/80 rounded-[8px] px-3 py-1">
          <span className="text-white font-semibold text-[12px] tracking-tight">{inferredType}</span>
        </div>

        {vote_average && (
          <div className="absolute top-2 right-2 bg-black/70 rounded-[8px] px-2 py-1">
            <span className="text-white font-semibold text-[11px] tracking-tight">* {vote_average.toFixed(1)}</span>
          </div>
        )}

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/90 via-black/45 to-transparent transition-all duration-350 rounded-[12px] flex flex-col items-center justify-center">
          <div className="text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <FaYoutube size={40} />
          </div>
        </div>
      </Link>

      <h4 className="text-[#f4eaea] text-left cursor-default text-[14px] font-medium leading-tight tracking-tight px-0.5">
        {(title?.length > 50 ? title.split(':')[0] : title) || name}
      </h4>
    </div>
  );
};

export default MovieCard;
