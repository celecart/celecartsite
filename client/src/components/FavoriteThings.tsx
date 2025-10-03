import React from 'react';

export interface FavoriteItem {
  category: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  tags: string[];
  description: string;
  isDouble?: boolean;
}

interface FavoriteThingsProps {
  items: FavoriteItem[];
}

export const FavoriteThings: React.FC<FavoriteThingsProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-amber-100">
          <h4 className="text-amber-700 font-medium mb-4">{item.category}</h4>
          {item.isDouble ? (
            <div className="h-40 mb-4 rounded-lg overflow-hidden grid grid-cols-2 gap-2">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={item.imageUrl.split(',')[0]} 
                  alt={`${item.title} - Image 1`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={item.imageUrl.split(',')[1]} 
                  alt={`${item.title} - Image 2`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="h-40 mb-4 rounded-lg overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h5 className="text-neutral-700 font-medium mb-1">{item.title}</h5>
          <h6 className="text-amber-600 mb-2">{item.subtitle}</h6>
          <div className="flex flex-wrap gap-2 mb-2">
            {item.tags.map((tag, tagIndex) => (
              <span 
                key={tagIndex} 
                className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-neutral-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FavoriteThings;