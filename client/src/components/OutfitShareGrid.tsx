import React from 'react';
import { OutfitShareCard } from './OutfitShareCard';

// Celebrity outfit example data
interface CelebrityOutfit {
  id: number;
  imageUrl: string;
  title: string;
  description?: string;
  productUrl?: string;
  price?: string;
  celebrityName: string;
  brandName?: string;
  productName?: string;
  occasion?: string;
}

// Sample data for outfits
const sampleOutfits: Record<string, CelebrityOutfit[]> = {
  // Kim Kardashian outfits
  "15": [
    {
      id: 1,
      imageUrl: "/assets/kim-kardashian/fashion/skims-bodysuit.png",
      title: "SKIMS Sculpting Bodysuit",
      description: "Kim's signature nude bodysuit that offers comfortable compression and sculpting.",
      productUrl: "https://skims.com/products/sculpting-bodysuit-above-the-knee-onyx",
      price: "$68.00",
      celebrityName: "Kim Kardashian",
      brandName: "SKIMS",
      productName: "Sculpting Bodysuit",
      occasion: "Everyday Wear"
    },
    {
      id: 2,
      imageUrl: "/assets/kim-kardashian/fashion/manolo-blahnik-heels.png",
      title: "Manolo Blahnik BB Pumps",
      description: "Iconic pointed-toe stiletto heels in vibrant pink suede, perfect for adding a pop of color.",
      productUrl: "https://www.manoloblahnik.com/us/women/shoes/",
      price: "$665.00",
      celebrityName: "Kim Kardashian",
      brandName: "Manolo Blahnik",
      productName: "BB Pumps",
      occasion: "Red Carpet"
    },
    {
      id: 3,
      imageUrl: "https://cdn.shopify.com/s/files/1/0570/0086/6432/files/SKU_SS22_05_COTTON_JERSEY_T_SHIRT_SIENNA_FLAT.jpg",
      title: "SKIMS Cotton T-Shirt",
      description: "Ultra-soft cotton jersey in a comfortable, flattering fit.",
      productUrl: "https://skims.com/products/cotton-jersey-t-shirt-sienna",
      price: "$42.00",
      celebrityName: "Kim Kardashian",
      brandName: "SKIMS",
      productName: "Cotton Jersey T-Shirt",
      occasion: "Casual"
    },
    {
      id: 4,
      imageUrl: "https://cdn-images.farfetch-contents.com/17/30/15/86/17301586_35756561_1000.jpg",
      title: "Balenciaga Oversized Hoodie",
      description: "Signature oversized fit with minimalist design in neutral tones.",
      productUrl: "https://www.balenciaga.com/en-us/women/ready-to-wear/sweatshirts",
      price: "$895.00",
      celebrityName: "Kim Kardashian",
      brandName: "Balenciaga",
      productName: "Oversized Hoodie",
      occasion: "Street Style"
    }
  ],
  // Blake Lively outfits
  "33": [
    {
      id: 1,
      imageUrl: "https://www.chanel.com/images//t_one///q_auto:good,f_auto,fl_lossy,dpr_1.2/w_1920/large-classic-handbag-black-grained-calfskin-gold-tone-metal-grained-calfskin-gold-tone-metal-packshot-default-a01112y01864c3906-8855073013790.jpg",
      title: "Chanel Classic Flap Bag",
      description: "Timeless black quilted leather with gold hardware, a Blake Lively staple.",
      productUrl: "https://www.chanel.com/us/fashion/p/A01112Y01864C3906/classic-handbag-grained-calfskin-gold-tone-metal/",
      price: "$8,800.00",
      celebrityName: "Blake Lively",
      brandName: "Chanel",
      productName: "Classic Flap Bag",
      occasion: "Upscale Events"
    },
    {
      id: 2,
      imageUrl: "https://www.christianlouboutin.com/media/catalog/product/3/2/3220356cm47-3220356cm47-main_image-cloudbustimis-1230x804_1.jpg",
      title: "Christian Louboutin Pigalle Pumps",
      description: "The iconic red-soled pump in beige patent leather.",
      productUrl: "https://www.christianlouboutin.com/us_en/pigalle-leather.html",
      price: "$775.00",
      celebrityName: "Blake Lively",
      brandName: "Christian Louboutin",
      productName: "Pigalle Pumps",
      occasion: "Red Carpet"
    }
  ],
  // Chris Evans outfits
  "34": [
    {
      id: 1,
      imageUrl: "https://www.mrporter.com/variants/images/1647597272498069/in/w2000_q60.jpg",
      title: "Todd Snyder Cashmere Sweater",
      description: "Luxurious navy cashmere sweater, perfect for Chris Evans' classic style.",
      productUrl: "https://www.toddsnyder.com/collections/sweaters",
      price: "$328.00",
      celebrityName: "Chris Evans",
      brandName: "Todd Snyder",
      productName: "Cashmere Sweater",
      occasion: "Smart Casual"
    }
  ]
};

interface OutfitShareGridProps {
  celebrityId: number | string;
  className?: string;
}

export function OutfitShareGrid({ celebrityId, className = '' }: OutfitShareGridProps) {
  const outfits = sampleOutfits[celebrityId.toString()] || [];
  
  if (outfits.length === 0) {
    return (
      <div className="text-center p-8 bg-neutral-50 rounded-lg border border-neutral-100">
        <p className="text-neutral-500">No outfits available for sharing yet.</p>
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {outfits.map((outfit) => (
        <OutfitShareCard
          key={outfit.id}
          imageUrl={outfit.imageUrl}
          title={outfit.title}
          description={outfit.description}
          productUrl={outfit.productUrl}
          price={outfit.price}
          celebrityName={outfit.celebrityName}
          brandName={outfit.brandName}
          productName={outfit.productName}
          occasion={outfit.occasion}
        />
      ))}
    </div>
  );
}