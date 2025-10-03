import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Info, ShoppingCart } from 'lucide-react';

interface ProductReview {
  rating: number;
  reviewCount: number;
}

interface ProductVariant {
  size: string;
  price: string;
  isSubscription?: boolean;
  savingsPercentage?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  productUrl: string;
  price: string;
  review?: ProductReview;
  benefits: string[];
  ingredients?: string[];
  howToUse?: string[];
  variants?: ProductVariant[];
  relatedProducts?: number[];
}

// Actual product data from SKKN by Kim
const skknProducts: Product[] = [
  {
    id: 1,
    name: "Cleanser Foaming Purifier",
    description: "A gentle, effective cleanser designed to lift away makeup, excess oil, and impurities without stripping the skin.",
    category: "Skincare",
    imageUrl: "/assets/kim-kardashian/skkn/cleanser.png",
    productUrl: "https://skknbykim.com/products/cleanser",
    price: "$43.00",
    review: {
      rating: 4.5,
      reviewCount: 52
    },
    benefits: [
      "Removes makeup without stripping the skin",
      "Creates a clean canvas for your skincare routine",
      "Maintains skin's natural moisture barrier",
      "Purifies pores and removes impurities"
    ],
    howToUse: [
      "Apply 1-2 pumps to damp skin.",
      "Massage in circular motions, focusing on the T-zone and areas with makeup.",
      "Rinse thoroughly with lukewarm water.",
      "Use morning and night."
    ],
    variants: [
      {
        size: "Standard (4.2 oz)",
        price: "$43.00",
        isSubscription: false
      },
      {
        size: "Standard (4.2 oz) - Subscription",
        price: "$38.70",
        isSubscription: true,
        savingsPercentage: "10%"
      }
    ]
  },
  {
    id: 2,
    name: "Toner",
    description: "A gentle exfoliating toner that helps minimize the appearance of pores and refines skin texture and tone.",
    category: "Skincare",
    imageUrl: "/assets/kim-kardashian/skkn/toner.png",
    productUrl: "https://skknbykim.com/products/toner",
    price: "$45.00",
    review: {
      rating: 4.6,
      reviewCount: 48
    },
    benefits: [
      "Refines skin texture and tone",
      "Gently exfoliates for smoother skin",
      "Minimizes the appearance of pores",
      "Prepares skin for next steps in routine"
    ],
    howToUse: [
      "After cleansing, saturate a cotton pad with toner.",
      "Sweep across face and neck, avoiding the eye area.",
      "Allow to absorb completely before applying serums.",
      "Use morning and night."
    ],
    variants: [
      {
        size: "Standard (6 oz)",
        price: "$45.00",
        isSubscription: false
      },
      {
        size: "Standard (6 oz) - Subscription",
        price: "$40.50",
        isSubscription: true,
        savingsPercentage: "10%"
      }
    ]
  },
  {
    id: 3,
    name: "Exfoliator",
    description: "A chemical and enzymatic exfoliator that sloughs away dead skin cells for smoother, more radiant skin.",
    category: "Skincare",
    imageUrl: "/assets/KKS_23_PACKSHOT_CLOSED_EXFSR_JPEG_1x1_144DPI.webp",
    productUrl: "https://skknbykim.com/products/exfoliator",
    price: "$55.00",
    review: {
      rating: 4.7,
      reviewCount: 43
    },
    benefits: [
      "Removes dead skin cells for smoother skin",
      "Improves absorption of other products",
      "Brightens dull skin",
      "Refines uneven skin texture"
    ],
    howToUse: [
      "After cleansing and toning, dispense 1-2 pumps onto fingertips.",
      "Gently massage onto damp face and neck using circular motions.",
      "Rinse thoroughly with lukewarm water.",
      "Use 1-2 times per week."
    ],
    variants: [
      {
        size: "Standard (4 oz)",
        price: "$55.00",
        isSubscription: false
      },
      {
        size: "Standard (4 oz) - Subscription",
        price: "$49.50",
        isSubscription: true,
        savingsPercentage: "10%"
      }
    ]
  },
  {
    id: 4,
    name: "Hyaluronic Acid Serum",
    description: "A multi-weight hyaluronic acid serum that delivers intense hydration for plumper, more supple skin.",
    category: "Skincare",
    imageUrl: "/assets/KKS_23_PACKSHOT_CLOSED_HA_SERUM_JPEG_1x1_144DPI.webp",
    productUrl: "https://skknbykim.com/products/hyaluronic-acid-serum",
    price: "$90.00",
    review: {
      rating: 4.8,
      reviewCount: 60
    },
    benefits: [
      "Deeply hydrates at multiple skin levels",
      "Plumps skin and reduces the appearance of fine lines",
      "Creates a smoother, more supple complexion",
      "Strengthens skin's moisture barrier"
    ],
    howToUse: [
      "After cleansing and toning, apply 1-2 pumps to fingertips.",
      "Gently press and pat into face and neck.",
      "Allow to absorb completely before applying moisturizer.",
      "Use morning and night."
    ],
    variants: [
      {
        size: "Standard (1 oz)",
        price: "$90.00",
        isSubscription: false
      },
      {
        size: "Standard (1 oz) - Subscription",
        price: "$81.00",
        isSubscription: true,
        savingsPercentage: "10%"
      }
    ]
  },
  {
    id: 5,
    name: "Vitamin C8 Serum",
    description: "A potent, stable Vitamin C serum that brightens skin tone, reduces hyperpigmentation, and defends against free radical damage.",
    category: "Skincare",
    imageUrl: "https://cdn.shopify.com/s/files/1/0672/3825/3874/files/PRP-05_VITAMINCSERUM_PDTPAGE_MOBILE_001_3ed8e11d-c4c2-478d-8c7c-cd0e93d59f19_750x.webp",
    productUrl: "https://skknbykim.com/products/vitamin-c8-serum",
    price: "$90.00",
    review: {
      rating: 4.9,
      reviewCount: 57
    },
    benefits: [
      "Brightens skin tone and reduces hyperpigmentation",
      "Protects against environmental damage",
      "Boosts collagen production",
      "Delivers antioxidant protection"
    ],
    howToUse: [
      "After cleansing and toning, apply 1-2 pumps to fingertips.",
      "Gently press and pat into face and neck.",
      "Allow to absorb completely before applying moisturizer.",
      "Use in the morning for best results."
    ],
    variants: [
      {
        size: "Standard (1 oz)",
        price: "$90.00",
        isSubscription: false
      },
      {
        size: "Standard (1 oz) - Subscription",
        price: "$81.00",
        isSubscription: true,
        savingsPercentage: "10%"
      }
    ]
  },
  {
    id: 6,
    name: "Face Cream",
    description: "A rich, hydrating cream that strengthens the skin's moisture barrier and provides long-lasting hydration.",
    category: "Skincare",
    imageUrl: "https://cdn.shopify.com/s/files/1/0672/3825/3874/files/PRP-06_FACECREAM_PDTPAGE_MOBILE_001_60c1a70b-4d3c-4913-98aa-1783664c75b4_750x.webp",
    productUrl: "https://skknbykim.com/products/face-cream",
    price: "$85.00",
    review: {
      rating: 4.7,
      reviewCount: 51
    },
    benefits: [
      "Provides intense, long-lasting hydration",
      "Strengthens skin's natural moisture barrier",
      "Reduces the appearance of fine lines",
      "Creates a smoother, more supple complexion"
    ],
    howToUse: [
      "After serums, apply a small amount to fingertips.",
      "Gently massage into face and neck using upward strokes.",
      "Use morning and night.",
      "Can be used as a day or night cream."
    ],
    variants: [
      {
        size: "Standard (1.6 oz)",
        price: "$85.00",
        isSubscription: false
      },
      {
        size: "Standard (1.6 oz) - Subscription",
        price: "$76.50",
        isSubscription: true,
        savingsPercentage: "10%"
      }
    ]
  },
  {
    id: 7,
    name: "Eye Cream",
    description: "A peptide-rich eye cream that reduces the appearance of fine lines, puffiness, and dark circles.",
    category: "Skincare",
    imageUrl: "https://cdn.shopify.com/s/files/1/0672/3825/3874/files/PRP-07_EYECREAM_PDTPAGE_MOBILE_001_b7b6c5e2-0c92-464d-9deb-0ef2f1d81da1_750x.webp",
    productUrl: "https://skknbykim.com/products/eye-cream",
    price: "$75.00",
    review: {
      rating: 4.6,
      reviewCount: 47
    },
    benefits: [
      "Reduces the appearance of fine lines and wrinkles",
      "Minimizes dark circles and puffiness",
      "Hydrates delicate eye area",
      "Brightens and firms the eye contour"
    ],
    howToUse: [
      "After serums, use ring finger to gently pat a small amount around the orbital bone.",
      "Avoid applying too close to the lash line.",
      "Use morning and night.",
      "Can be applied under makeup."
    ],
    variants: [
      {
        size: "Standard (0.5 oz)",
        price: "$75.00",
        isSubscription: false
      },
      {
        size: "Standard (0.5 oz) - Subscription",
        price: "$67.50",
        isSubscription: true,
        savingsPercentage: "10%"
      }
    ]
  },
  {
    id: 8,
    name: "Oil Drops",
    description: "A lightweight facial oil that nourishes, soothes, and protects the skin's moisture barrier.",
    category: "Skincare",
    imageUrl: "https://cdn.shopify.com/s/files/1/0672/3825/3874/files/PRP-08_OILDROPS_PDTPAGE_MOBILE_001_9d6c1a83-dcbb-4d2e-94fc-afd8fac8de59_750x.webp",
    productUrl: "https://skknbykim.com/products/oil-drops",
    price: "$95.00",
    review: {
      rating: 4.7,
      reviewCount: 44
    },
    benefits: [
      "Nourishes and protects skin",
      "Seals in moisture without feeling greasy",
      "Adds a natural radiance to the skin",
      "Soothes and calms skin"
    ],
    howToUse: [
      "After moisturizer, dispense 2-3 drops onto fingertips.",
      "Gently press into face and neck.",
      "Can be mixed with face cream for added hydration.",
      "Use morning and/or night as needed."
    ],
    variants: [
      {
        size: "Standard (1 oz)",
        price: "$95.00",
        isSubscription: false
      },
      {
        size: "Standard (1 oz) - Subscription",
        price: "$85.50",
        isSubscription: true,
        savingsPercentage: "10%"
      }
    ]
  },
  {
    id: 9,
    name: "Night Oil",
    description: "A luxurious, retinoid-infused night oil that promotes cell renewal and reduces the appearance of fine lines.",
    category: "Skincare",
    imageUrl: "https://cdn.shopify.com/s/files/1/0672/3825/3874/files/PRP-09_NIGHTOIL_PDTPAGE_MOBILE_001_d7a35aee-9ad1-4a9a-9e1f-28d257c9a0f5_750x.webp",
    productUrl: "https://skknbykim.com/products/night-oil",
    price: "$95.00",
    review: {
      rating: 4.8,
      reviewCount: 39
    },
    benefits: [
      "Promotes cell renewal for smoother, more youthful skin",
      "Reduces the appearance of fine lines and wrinkles",
      "Enhances skin's natural repair process overnight",
      "Improves skin texture and tone"
    ],
    howToUse: [
      "After evening skincare routine, dispense 2-3 drops onto fingertips.",
      "Gently press into face and neck.",
      "Use 2-3 times per week, gradually increasing to nightly use as tolerated.",
      "Always use SPF during the day when using this product."
    ],
    variants: [
      {
        size: "Standard (1 oz)",
        price: "$95.00",
        isSubscription: false
      },
      {
        size: "Standard (1 oz) - Subscription",
        price: "$85.50",
        isSubscription: true,
        savingsPercentage: "10%"
      }
    ]
  }
];

// Product Sets
const skknSets = [
  {
    id: 101,
    name: "The Complete Collection",
    description: "The full 9-product system designed to deliver a complete skincare routine.",
    category: "Sets",
    imageUrl: "https://cdn.shopify.com/s/files/1/0672/3825/3874/files/PRP-01_COMP_PDTPAGE_MOBILE_001_0fc28ada-2cfa-4c41-8f04-a57a89c67ba5_750x.webp",
    productUrl: "https://skknbykim.com/products/complete-collection",
    price: "$575.00",
    review: {
      rating: 4.9,
      reviewCount: 32
    },
    benefits: [
      "Complete 9-step skincare system",
      "Everything needed for a comprehensive routine",
      "Designed to work together for optimal results",
      "Includes all SKKN BY KIM products"
    ],
    variants: [
      {
        size: "Complete Collection",
        price: "$575.00",
        isSubscription: false
      },
      {
        size: "Complete Collection - Subscription",
        price: "$517.50",
        isSubscription: true,
        savingsPercentage: "10%"
      }
    ]
  },
  {
    id: 102,
    name: "The Essential 5-Product Bundle",
    description: "A 5-product system designed to deliver the essential steps of a skincare routine.",
    category: "Sets",
    imageUrl: "https://cdn.shopify.com/s/files/1/0672/3825/3874/files/PRP-01_5STP_PDTPAGE_MOBILE_001_1d2c3b51-30e5-46b1-ae1c-b5be6f8bf0d5_750x.webp",
    productUrl: "https://skknbykim.com/products/essential-5-product-bundle",
    price: "$305.00",
    review: {
      rating: 4.8,
      reviewCount: 27
    },
    benefits: [
      "Essential 5-step skincare system",
      "Perfect introduction to the SKKN BY KIM line",
      "Core products for a complete routine",
      "Simplified yet effective regimen"
    ],
    variants: [
      {
        size: "5-Product Bundle",
        price: "$305.00",
        isSubscription: false
      },
      {
        size: "5-Product Bundle - Subscription",
        price: "$274.50",
        isSubscription: true,
        savingsPercentage: "10%"
      }
    ]
  },
  {
    id: 103,
    name: "The Travel Set",
    description: "Travel-sized versions of the SKKN BY KIM essentials to maintain your routine on the go.",
    category: "Sets",
    imageUrl: "https://cdn.shopify.com/s/files/1/0672/3825/3874/files/8_19_2023_SKKN_ASSET_MOBILE_3_1_750x.webp",
    productUrl: "https://skknbykim.com/products/travel-set",
    price: "$125.00",
    review: {
      rating: 4.7,
      reviewCount: 22
    },
    benefits: [
      "TSA-friendly travel sizes",
      "Key products for maintaining skin while traveling",
      "Includes travel pouch",
      "Perfect for gifting or trying the line"
    ],
    variants: [
      {
        size: "Travel Set",
        price: "$125.00",
        isSubscription: false
      }
    ]
  }
];

// Combine products and sets
const allSkknProducts = [...skknProducts, ...skknSets];

// Render star ratings helper
const RenderStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < fullStars ? "text-amber-500" : (i === fullStars && hasHalfStar ? "text-amber-300" : "text-gray-300")}>
          <Star className="w-4 h-4 fill-current" />
        </span>
      ))}
    </div>
  );
};

// Product card component
const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-neutral-100 hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square bg-neutral-50 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="object-contain w-full h-full p-4"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 font-playfair">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        
        {product.review && (
          <div className="flex items-center gap-2 mb-2">
            <RenderStars rating={product.review.rating} />
            <span className="text-xs text-gray-500">({product.review.reviewCount})</span>
          </div>
        )}
        
        <p className="text-gold font-medium mb-3">{product.price}</p>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
        
        <div className="flex gap-2">
          <Button 
            asChild
            className="flex-1 bg-gold hover:bg-gold/90 text-dark"
          >
            <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shop Now
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main component
export default function SKKNProducts() {
  return (
    <div className="py-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold font-playfair mb-4 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
          SKKN BY KIM Collection
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover Kim Kardashian's premium skincare line featuring carefully formulated products 
          designed to nourish, rejuvenate, and protect your skin.
        </p>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full mb-6 justify-center border-b">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="skincare">Skincare</TabsTrigger>
          <TabsTrigger value="sets">Sets & Collections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allSkknProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="skincare" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {skknProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skknSets.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 bg-neutral-50 p-6 rounded-lg border border-neutral-100">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="p-3 bg-gold/20 rounded-full">
            <Info className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">About SKKN BY KIM</h3>
            <p className="text-gray-600 mb-4">
              SKKN BY KIM was created from Kim Kardashian's dream to bridge the gap between the world's most renowned dermatologists and people at home seeking high-quality skincare. Developed with the expertise of celebrity esthetician Joanna Czech, these products deliver clinically proven solutions for all skin types.
            </p>
            <p className="text-gray-600">
              Each product is crafted from carefully selected ingredients and designed with refillable packaging to reduce environmental impact. The complete collection consists of nine products that work together to nourish, rejuvenate, and maintain the complexion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}