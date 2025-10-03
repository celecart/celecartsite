import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  fallbackText?: string;
  fallbackClassName?: string;
  imgClassName?: string;
  alt: string;
  className?: string;
}

export function FallbackImage({
  src,
  fallbackSrc,
  fallbackText,
  alt,
  className,
  imgClassName,
  fallbackClassName,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showFallback, setShowFallback] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setShowFallback(false);
  }, [src]);

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
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