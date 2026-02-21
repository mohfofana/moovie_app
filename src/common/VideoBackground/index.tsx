import { useState, useEffect } from 'react';
import { cn } from '@/utils/helper';

interface VideoBackgroundProps {
  videoKey?: string;
  backdropPath?: string;
  className?: string;
  overlayTone?: 'default' | 'light';
}

const VideoBackground = ({
  videoKey,
  backdropPath,
  className,
  overlayTone = 'default',
}: VideoBackgroundProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const overlayRightClass =
    overlayTone === 'light'
      ? 'absolute inset-0 bg-gradient-to-r from-black/58 via-black/18 to-black/52 z-10'
      : 'absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/80 z-10';

  const overlayBottomClass =
    overlayTone === 'light'
      ? 'absolute inset-0 bg-gradient-to-t from-black/74 via-black/24 to-transparent z-10'
      : 'absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10';

  useEffect(() => {
    // Show video after a short delay to ensure smooth loading
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [videoKey]);

  // If no video key, show backdrop image
  if (!videoKey) {
    return (
      <div className={cn('absolute inset-0', className)}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://image.tmdb.org/t/p/original/${backdropPath}')`,
          }}
        />
        <div className={overlayRightClass} />
        <div className={overlayBottomClass} />
      </div>
    );
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {/* Video container with aspect ratio trick */}
      {showVideo && (
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoKey}&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1`}
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'min-w-full min-h-full w-auto h-auto',
              'pointer-events-none',
              'transition-opacity duration-1000',
              // Make sure video covers the entire viewport
              'scale-150 sm:scale-125 lg:scale-100',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            style={{
              width: '100vw',
              height: '56.25vw', // 16:9 aspect ratio (9/16 = 0.5625)
              minHeight: '100vh',
              minWidth: '177.77vh', // 16:9 aspect ratio (16/9 = 1.7777)
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoaded(true)}
            title="Background video"
          />
        </div>
      )}

      {/* Fallback backdrop image while video loads */}
      {!isLoaded && backdropPath && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://image.tmdb.org/t/p/original/${backdropPath}')`,
          }}
        />
      )}

      <div className={overlayRightClass} />
      <div className={overlayBottomClass} />
    </div>
  );
};

export default VideoBackground;
