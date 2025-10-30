import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  backupSrc?: string | string[];
  fallbackSrc?: string;
  fallbackText?: string;
  fallbackClassName?: string;
  imgClassName?: string;
  alt: string;
  className?: string;
}

export function FallbackImage({
  src,
  backupSrc,
  fallbackSrc,
  fallbackText,
  alt,
  className,
  imgClassName,
  fallbackClassName,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [showFallback, setShowFallback] = useState<boolean>(false);
  const [sourceIndex, setSourceIndex] = useState<number>(0);

  // Build a prioritized list of sources: primary src -> backup(s) -> fallbackSrc
  const buildSources = (): string[] => {
    const backups = Array.isArray(backupSrc)
      ? backupSrc.filter(Boolean)
      : backupSrc
        ? [backupSrc]
        : [];
    const sources: string[] = [];
    if (src && src.trim() !== '') sources.push(src);
    sources.push(...backups.filter(s => typeof s === 'string' && s.trim() !== ''));
    if (fallbackSrc && fallbackSrc.trim() !== '') sources.push(fallbackSrc);
    return sources;
  };

  useEffect(() => {
    const sources = buildSources();
    if (sources.length === 0) {
      setShowFallback(true);
      setImgSrc('');
      setSourceIndex(0);
      return;
    }
    setImgSrc(sources[0]);
    setSourceIndex(0);
    setShowFallback(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, backupSrc, fallbackSrc]);

  const handleError = () => {
    const sources = buildSources();
    const nextIndex = sourceIndex + 1;
    if (nextIndex < sources.length) {
      setImgSrc(sources[nextIndex]);
      setSourceIndex(nextIndex);
    } else if (!showFallback) {
      setShowFallback(true);
    }
  };

  if (showFallback) {
    return (
      <div className={cn("w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center", fallbackClassName || className)}>
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
              {alt.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {fallbackText || "Image not available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={cn(imgClassName || className)}
      {...props}
    />
  );
}