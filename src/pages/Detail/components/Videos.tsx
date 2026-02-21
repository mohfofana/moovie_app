import { FC } from 'react';
import { maxWidth } from '@/styles';
import { cn } from '@/utils/helper';

interface VideosProps {
  videos?: { id: string; name: string; key: string }[];
}

const Videos: FC<VideosProps> = ({ videos = [] }) => {
  const youtubeVideos = videos.slice(0, 2);
  if (youtubeVideos.length === 0) return null;

  return (
    <section
      className={cn(
        maxWidth,
        'flex flex-col lg:gap-12 md:gap-10 sm:gap-8 gap-6 lg:py-16 md:py-14 sm:py-10 py-8'
      )}
    >
      <div>
        <h2 className="font-roboto text-[32px] sm:text-[38px] text-white">Videos & bande annonces</h2>
      </div>
      {youtubeVideos.map((video) => {
        return (
          <div
            key={video.id}
            className="w-full flex flex-col gap-3"
          >
            <h3 className="text-gray-100 font-semibold text-[18px]">{video.name}</h3>
            <div className="w-full lg:h-[480px] md:h-[420px] sm:h-[320px] h-[210px] rounded-2xl overflow-hidden border border-white/10 shadow-xl">
              <iframe
                src={`https://www.youtube.com/embed/${video.key}?enablejsapi=1`}
                title="trailer"
                width="100%"
                height="100%"
                className="rounded-2xl"
                allowFullScreen
              />
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Videos;
