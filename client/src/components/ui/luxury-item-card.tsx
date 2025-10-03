import React from 'react';

interface LuxuryItemCardProps {
  imageSrc: string;
  title: string;
  category: string;
  price: string;
  description: string;
  shopUrl: string;
}

export function LuxuryItemCard({
  imageSrc,
  title,
  category,
  price,
  description,
  shopUrl
}: LuxuryItemCardProps) {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-lg shadow-sm border border-amber-200">
      <div className="flex justify-center mb-4">
        <div className="h-40 w-full bg-white rounded overflow-hidden">
          <img 
            src={imageSrc}
            alt={title} 
            className="h-full w-full object-contain mx-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://placehold.co/200x200/png?text=Image+Not+Found";
            }}
          />
        </div>
      </div>
      <h4 className="text-xl font-playfair font-semibold mb-3 text-amber-700 text-center">{title}</h4>
      <div className="text-amber-600 text-lg font-medium mb-1 text-center">{category}</div>
      <div className="flex justify-center mb-3">
        <div className="inline-block bg-amber-200 text-amber-800 px-2 py-1 text-sm font-medium rounded">{price}</div>
      </div>
      <p className="text-gray-700 text-center">
        {description}
      </p>
      <div className="flex justify-center">
        <a 
          href={shopUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-4 bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2 rounded text-sm transition-colors"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
}