import React from 'react';
import { FallbackImage } from '@/components/ui/fallback-image';

interface BrandImageProps {
  imageUrl?: string;
  brandName?: string;
  className?: string;
}

export default function BrandImage({ imageUrl, brandName, className = "w-full h-full object-contain p-2" }: BrandImageProps) {
  return (
    <div className="max-w-[200px] mx-auto">
      <FallbackImage 
        src={imageUrl} 
        alt={brandName || 'Brand image'} 
        fallbackText={brandName}
        imgClassName={className}
        fallbackClassName="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 font-bold"
        loading="lazy"
      />
    </div>
  );
}