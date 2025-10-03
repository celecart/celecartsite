interface AccessibleItemCardProps {
  imageSrc: string;
  title: string;
  category: string;
  price: string;
  originalPrice?: string;
  description: string;
  shopUrl: string;
  isPopular?: boolean;
}

export function AccessibleItemCard({
  imageSrc,
  title,
  category,
  price,
  originalPrice,
  description,
  shopUrl,
  isPopular = false
}: AccessibleItemCardProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow-sm border border-blue-200 relative">
      {isPopular && (
        <div className="absolute -top-2 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
          Most Popular
        </div>
      )}
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
      <h4 className="text-xl font-playfair font-semibold mb-3 text-purple-700 text-center">{title}</h4>
      <div className="text-blue-600 text-lg font-medium mb-1 text-center">{category}</div>
      <div className="flex justify-center mb-3 gap-2">
        <div className="inline-block bg-green-200 text-green-800 px-2 py-1 text-sm font-medium rounded">{price}</div>
        {originalPrice && (
          <div className="inline-block bg-gray-200 text-gray-600 px-2 py-1 text-sm font-medium rounded line-through">{originalPrice}</div>
        )}
      </div>
      <p className="text-gray-700 text-center text-sm">
        {description}
      </p>
      <div className="flex justify-center">
        <a 
          href={shopUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-4 py-2 rounded text-sm transition-all transform hover:scale-105"
          data-testid="button-shop-accessible"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
}