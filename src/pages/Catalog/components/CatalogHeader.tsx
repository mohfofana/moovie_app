import bgImg from '@/assets/images/footer-bg.webp';

const CatalogHeader = ({ category }: { category: string }) => {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to right, rgba(14,6,6,0.82), rgba(14,6,6,0.72)), url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="lg:h-[240px] md:h-[220px] sm:h-[200px] h-[170px] relative border-b border-white/10"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(9,4,4,0.84)]" />
      <div className="absolute left-1/2 -translate-x-1/2 lg:bottom-10 md:bottom-8 bottom-6 w-full max-w-[1220px] px-4 sm:px-6 md:px-8">
        <p className="text-[#d96565] text-sm mb-2">Genres</p>
        <h2 className="text-white font-roboto capitalize font-semibold md:text-[44px] sm:text-[36px] text-[30px] leading-none">
          {category === 'movie' ? 'movies' : 'tv series'}
        </h2>
      </div>
    </div>
  );
};

export default CatalogHeader;
