import { AccessibleItemCard } from "@/components/ui/accessible-item-card";

const accessibleItems = [
  // MAKEUP PRODUCTS
  {
    id: 1,
    title: "Red Carpet Glow Foundation",
    category: "Makeup",
    imageSrc: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop",
    price: "$39.00",
    originalPrice: "$52.00",
    description: "Celebrity makeup artist favorite! Get that flawless red carpet glow with this medium-full coverage foundation. Perfect for photos and events.",
    shopUrl: "https://www.sephora.com/product/complexion-rescue-tinted-hydrating-gel-cream-broad-spectrum-spf-30-P393965",
    isPopular: true
  },
  {
    id: 2,
    title: "Celebrity Signature Lipstick",
    category: "Makeup",
    imageSrc: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop",
    price: "$22.00",
    originalPrice: "$30.00",
    description: "Matte liquid lipstick in celebrity-approved shades. Long-wearing, transfer-resistant formula that looks perfect in selfies and photos.",
    shopUrl: "https://www.sephora.com/product/liquid-catsuit-matte-lipstick-P433742",
    isPopular: true
  },
  {
    id: 3,
    title: "Red Carpet Highlighter Palette",
    category: "Makeup",
    imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
    price: "$32.00",
    originalPrice: "$45.00",
    description: "Get that celebrity glow! Multi-use highlighting palette with shades for every skin tone. Creates the perfect luminous finish for photos.",
    shopUrl: "https://www.sephora.com/product/killawatt-freestyle-highlighter-P20193612",
    isPopular: false
  },
  {
    id: 4,
    title: "Celebrity Eyeshadow Palette",
    category: "Makeup",
    imageSrc: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop",
    price: "$28.00",
    originalPrice: "$38.00",
    description: "Smoky eye essentials used by celebrity makeup artists. Highly pigmented, blendable shades perfect for recreating iconic red carpet looks.",
    shopUrl: "https://www.sephora.com/product/born-to-run-eyeshadow-palette-P67779227",
    isPopular: true
  },
  {
    id: 5,
    title: "Volumizing Mascara",
    category: "Makeup",
    imageSrc: "https://images.unsplash.com/photo-1631214542182-0c42c2717cd4?w=300&h=300&fit=crop",
    price: "$24.00",
    originalPrice: "$32.00",
    description: "Award-winning mascara for dramatic lashes. Creates volume and length without clumping - perfect for achieving that celebrity flutter.",
    shopUrl: "https://www.sephora.com/product/better-than-sex-mascara-P381094",
    isPopular: true
  },
  {
    id: 6,
    title: "Contouring Kit",
    category: "Makeup",
    imageSrc: "https://images.unsplash.com/photo-1567721913486-6585f069b332?w=300&h=300&fit=crop",
    price: "$35.00",
    originalPrice: "$48.00",
    description: "Professional contouring and highlighting kit. Sculpt and define like a celebrity makeup artist with this easy-to-use palette.",
    shopUrl: "https://www.sephora.com/product/contour-kit-P393637",
    isPopular: false
  },
  {
    id: 7,
    title: "Setting Spray",
    category: "Makeup",
    imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
    price: "$33.00",
    originalPrice: "$42.00",
    description: "Long-lasting setting spray that keeps makeup fresh for 16 hours. Celebrity favorite for red carpet events and photoshoots.",
    shopUrl: "https://www.sephora.com/product/all-nighter-long-lasting-makeup-setting-spray-P263504",
    isPopular: true
  },
  {
    id: 8,
    title: "Brow Definer Pencil",
    category: "Makeup",
    imageSrc: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=300&h=300&fit=crop",
    price: "$23.00",
    originalPrice: "$29.00",
    description: "Precision brow pencil for perfectly defined eyebrows. Create natural-looking, full brows that frame your face beautifully.",
    shopUrl: "https://www.sephora.com/product/brow-wiz-P202633",
    isPopular: false
  },
  {
    id: 9,
    title: "Blush Compact",
    category: "Makeup",
    imageSrc: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop",
    price: "$26.00",
    originalPrice: "$35.00",
    description: "Buildable blush in celebrity-favorite shades. Adds a natural, healthy glow that photographs beautifully.",
    shopUrl: "https://www.sephora.com/product/orgasm-blush-P2855",
    isPopular: false
  },

  // SKINCARE PRODUCTS
  {
    id: 10,
    title: "Vitamin C Serum",
    category: "Skincare",
    imageSrc: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
    price: "$45.00",
    originalPrice: "$62.00",
    description: "Brightening vitamin C serum for glowing skin. Celebrity skincare secret for radiant, even-toned complexion.",
    shopUrl: "https://www.sephora.com/product/c-e-ferulic-P4057",
    isPopular: true
  },
  {
    id: 11,
    title: "Hyaluronic Acid Moisturizer",
    category: "Skincare",
    imageSrc: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    price: "$29.00",
    originalPrice: "$38.00",
    description: "Intensive hydrating moisturizer with hyaluronic acid. Plumps and smooths skin for that celebrity glow.",
    shopUrl: "https://www.sephora.com/product/hyaluronic-acid-2-b5-P427417",
    isPopular: true
  },
  {
    id: 12,
    title: "Gentle Foam Cleanser",
    category: "Skincare",
    imageSrc: "https://images.unsplash.com/photo-1556229162-6bb4a3cc54c9?w=300&h=300&fit=crop",
    price: "$32.00",
    originalPrice: "$44.00",
    description: "Gentle daily cleanser that removes makeup and impurities. Celebrity-approved for maintaining clear, healthy skin.",
    shopUrl: "https://www.sephora.com/product/soy-face-cleanser-P61012",
    isPopular: false
  },
  {
    id: 13,
    title: "Retinol Night Cream",
    category: "Skincare",
    imageSrc: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop",
    price: "$55.00",
    originalPrice: "$72.00",
    description: "Anti-aging retinol cream for smooth, youthful skin. Celebrity skincare essential for maintaining a flawless complexion.",
    shopUrl: "https://www.sephora.com/product/a313-vitamin-a-pommade-P433409",
    isPopular: true
  },
  {
    id: 14,
    title: "Eye Cream",
    category: "Skincare",
    imageSrc: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop",
    price: "$38.00",
    originalPrice: "$52.00",
    description: "Firming eye cream that reduces puffiness and dark circles. Celebrity makeup artists' favorite for photo-ready eyes.",
    shopUrl: "https://www.sephora.com/product/ceramidin-eye-cream-P427404",
    isPopular: false
  },
  {
    id: 15,
    title: "Face Mask Set",
    category: "Skincare",
    imageSrc: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop",
    price: "$42.00",
    originalPrice: "$58.00",
    description: "Luxury face mask collection for deep hydration and glow. Celebrity spa treatment you can do at home.",
    shopUrl: "https://www.sephora.com/product/the-honey-mask-P442843",
    isPopular: true
  },
  {
    id: 16,
    title: "Toner & Essence",
    category: "Skincare",
    imageSrc: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
    price: "$35.00",
    originalPrice: "$46.00",
    description: "Hydrating toner that preps skin for skincare routine. Celebrity favorite for achieving that dewy, healthy glow.",
    shopUrl: "https://www.sephora.com/product/treatment-essence-P428651",
    isPopular: false
  },

  // FRAGRANCE & OTHER PRODUCTS
  {
    id: 17,
    title: "Celebrity Signature Perfume",
    category: "Fragrance",
    imageSrc: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
    price: "$68.00",
    originalPrice: "$85.00",
    description: "Luxurious fragrance inspired by red carpet glamour. Long-lasting scent with notes of florals and sophistication.",
    shopUrl: "https://www.sephora.com/product/good-girl-eau-de-parfum-P432715",
    isPopular: true
  },
  {
    id: 18,
    title: "Makeup Brush Set",
    category: "Beauty Tools",
    imageSrc: "https://images.unsplash.com/photo-1595706103751-3cc34bbfe5c6?w=300&h=300&fit=crop",
    price: "$48.00",
    originalPrice: "$65.00",
    description: "Professional makeup brush collection used by celebrity makeup artists. Achieve flawless application every time.",
    shopUrl: "https://www.sephora.com/product/everyday-eye-essentials-5-piece-brush-set-P428073",
    isPopular: true
  },
  {
    id: 19,
    title: "Beauty Sponge Set",
    category: "Beauty Tools",
    imageSrc: "https://images.unsplash.com/photo-1582719371843-1c9866ba267f?w=300&h=300&fit=crop",
    price: "$18.00",
    originalPrice: "$25.00",
    description: "Professional makeup sponges for flawless foundation application. Celebrity makeup artist essential for perfect coverage.",
    shopUrl: "https://www.sephora.com/product/original-beautyblender-P228913",
    isPopular: false
  },
  {
    id: 20,
    title: "Lip Treatment Oil",
    category: "Skincare",
    imageSrc: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop",
    price: "$24.00",
    originalPrice: "$32.00",
    description: "Nourishing lip oil for soft, glossy lips. Celebrity favorite for maintaining perfect lips between makeup applications.",
    shopUrl: "https://www.sephora.com/product/addict-lip-glow-oil-P467930",
    isPopular: true
  }
];

export default function AccessibleCollection() {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-2">
            Accessible Collection
          </h3>
          <p className="text-gray-600">
            Celebrity-inspired beauty and fashion that's within reach. Get the same look for less with Sephora favorites.
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full">
          <span className="text-purple-700 font-medium text-sm">💄 Sephora Favorites</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {accessibleItems.map((item) => (
          <AccessibleItemCard
            key={item.id}
            imageSrc={item.imageSrc}
            title={item.title}
            category={item.category}
            price={item.price}
            originalPrice={item.originalPrice}
            description={item.description}
            shopUrl={item.shopUrl}
            isPopular={item.isPopular}
          />
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-purple-700 mb-2">Why Choose Our Accessible Collection?</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">💄</span>
              </div>
              <p className="text-sm text-gray-700"><strong>Makeup Essentials</strong><br />Foundation, lipstick, eyeshadow & more</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">🧴</span>
              </div>
              <p className="text-sm text-gray-700"><strong>Skincare Heroes</strong><br />Serums, moisturizers & treatments</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-pink-600 font-bold">🌸</span>
              </div>
              <p className="text-sm text-gray-700"><strong>Fragrance & Tools</strong><br />Perfumes, brushes & beauty accessories</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">💰</span>
              </div>
              <p className="text-sm text-gray-700"><strong>Affordable Luxury</strong><br />Celebrity looks for less at Sephora</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}