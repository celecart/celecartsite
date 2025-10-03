import React from 'react';
import { CelebrityBrandWithDetails } from '@/pages/CelebrityProfile';

interface PersonalFavouriteProps {
  items: CelebrityBrandWithDetails[];
  celebrity?: any;
}

export default function PersonalFavourite({ items, celebrity }: PersonalFavouriteProps) {
  // Get items by type
  const sunglassesItems = items.filter(item => item.itemType === 'Sunglasses');
  const jacketItems = items.filter(item => item.itemType === 'Jacket');
  
  // Get the items we want to display
  const rayBanItem = sunglassesItems.find(item => item.brand?.name === "Ray-Ban");
  const randolphItem = sunglassesItems.find(item => item.brand?.name === "Randolph Engineering");
  const topGunJacket = jacketItems.find(item => item.brand?.name === "Schott NYC");

  return (
    <>
      <h3 className="text-3xl font-playfair font-bold text-center text-amber-600 mb-8">
        Tom's Favorite Experiences
      </h3>
      
      <div className="bg-white p-8 rounded-lg border border-amber-100 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ray-Ban Aviator Sunglasses */}
          <div className="flex flex-col">
            <h4 className="text-amber-700 font-medium mb-4">Signature Eyewear</h4>
            <div className="h-40 mb-4 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Ray-Ban Aviator Sunglasses" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h5 className="text-neutral-700 font-medium mb-1">Iconic Film Sunglasses</h5>
            <h6 className="text-amber-600 mb-2">Ray-Ban Aviators</h6>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">Classic Style</span>
              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">Film Icon</span>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              The legendary Ray-Ban Aviator sunglasses worn by Tom Cruise in "Top Gun" that defined an era of style.
            </p>
            <a 
              href={rayBanItem?.equipmentSpecs?.purchaseLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto text-xs text-amber-600 hover:underline font-medium"
            >
              Shop Now →
            </a>
          </div>

          {/* Top Gun Pilot Jacket */}
          <div className="flex flex-col">
            <h4 className="text-amber-700 font-medium mb-4">Signature Jacket</h4>
            <div className="h-40 mb-4 rounded-lg overflow-hidden">
              <img 
                src="/assets/tom-cruise/top-gun-jacket.jpg" 
                alt="Top Gun Pilot Jacket" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h5 className="text-neutral-700 font-medium mb-1">Top Gun Pilot Jacket</h5>
            <h6 className="text-amber-600 mb-2">Schott NYC</h6>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">Leather</span>
              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">Iconic</span>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              Authentic G-1 style leather flight jacket with shearling collar, similar to the iconic jacket worn by Tom Cruise as Maverick.
            </p>
            <a 
              href="https://topgunstore.com/collections/jackets/products/top-gun%C2%AE-official-signature-series-jacket-1-0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto text-xs text-amber-600 hover:underline font-medium"
            >
              Shop Now →
            </a>
          </div>

          {/* Randolph Aviators */}
          <div className="flex flex-col">
            <h4 className="text-amber-700 font-medium mb-4">Military-Grade Eyewear</h4>
            <div className="h-40 mb-4 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Randolph Aviator Sunglasses" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h5 className="text-neutral-700 font-medium mb-1">Military Spec Sunglasses</h5>
            <h6 className="text-amber-600 mb-2">Randolph Aviators</h6>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">Premium</span>
              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">Handcrafted</span>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              Handcrafted aviator sunglasses from Randolph Engineering, the official supplier to the U.S. Military since 1982.
            </p>
            <a 
              href={randolphItem?.equipmentSpecs?.purchaseLink || "https://www.randolphusa.com/products/aviator-military-special-edition-23k-gold?_pos=9&_fid=2ff7ee0f4&_ss=c"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto text-xs text-amber-600 hover:underline font-medium"
            >
              Shop Now →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}