import { useQuery } from "@tanstack/react-query";
import { Package, Star, ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CelebrityProduct {
  id: number;
  celebrityId: number;
  name: string;
  description: string;
  category: string;
  productCategory?: string;
  imageUrl: string;
  price: string;
  location: string;
  website: string;
  purchaseLink: string;
  rating: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CelebrityProductsProps {
  celebrityId: number;
}

export default function CelebrityProducts({ celebrityId }: CelebrityProductsProps) {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['celebrity-products', celebrityId],
    queryFn: async () => {
      const res = await fetch(`/api/celebrity-products?celebrityId=${celebrityId}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json() as CelebrityProduct[];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-8 border border-amber-200 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load products</h3>
        <p className="text-gray-600">There was an error loading the celebrity products.</p>
      </div>
    );
  }

  const activeProducts = products?.filter(product => product.isActive) || [];
  const featuredProducts = activeProducts.filter(product => product.isFeatured);
  const regularProducts = activeProducts.filter(product => !product.isFeatured);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-8 border border-amber-200 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-playfair font-bold mb-3 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent">
              Celebrity Products
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Discover exclusive products and recommendations curated by this celebrity. From signature items to personal favorites, explore their handpicked collection.
            </p>
          </div>
        </div>
      </div>

      {activeProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
          <p className="text-gray-600">This celebrity hasn't added any products yet. Check back later for updates!</p>
        </div>
      ) : (
        <>
          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h4 className="text-2xl font-playfair font-bold text-gray-900">Featured Products</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} featured />
                ))}
              </div>
            </div>
          )}

          {/* Regular Products */}
          {regularProducts.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-600" />
                <h4 className="text-2xl font-playfair font-bold text-gray-900">All Products</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: CelebrityProduct;
  featured?: boolean;
}

function ProductCard({ product, featured = false }: ProductCardProps) {
  const imageSrc = (() => {
    const val = product.imageUrl;
    if (!val) return '';
    try {
      if (typeof val === 'string' && val.trim().startsWith('[')) {
        const arr = JSON.parse(val);
        if (Array.isArray(arr)) return arr[0] || '';
      }
    } catch {}
    return val as string;
  })();
  return (
    <div className={`relative rounded-xl overflow-hidden border hover:shadow-md transition-all duration-300 ${
      featured ? 'border-amber-200 ring-2 ring-amber-100' : 'border-gray-200'
    }`}>
      {/* Product Image with overlays */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Dark gradient overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-amber-600 text-white px-2 py-0.5 rounded-full">
              Featured
            </Badge>
          </div>
        )}

        {/* Price badge */}
        {product.price && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-emerald-600 text-white px-2 py-0.5 rounded-full">
              {product.price}
            </Badge>
          </div>
        )}

        {/* Bottom labels: name and category */}
        <div className="absolute bottom-2 left-2 right-2 text-white">
          <div className="text-sm font-semibold line-clamp-1">{product.name}</div>
          <div className="text-xs opacity-90 line-clamp-1">{product.category}</div>
        </div>
      </div>
    </div>
  );
}