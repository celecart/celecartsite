import BrandImage from "@/components/BrandImage";
import { CelebrityBrandWithDetails } from "@/pages/CelebrityProfile";

interface SignatureEquipmentProps {
  items: CelebrityBrandWithDetails[];
}

export default function SignatureEquipment({ items }: SignatureEquipmentProps) {
  return (
    <div className="space-y-4 mt-6">
      {items
        .filter((item) => 
          item.itemType === 'Racquet' || 
          item.itemType === 'Footwear' || 
          item.itemType === 'Football Boots'
        )
        .map((item) => (
          <div key={item.id} className="flex items-start gap-4 border-b border-gray-200 pb-4">
            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <BrandImage 
                imageUrl={item.brand?.imageUrl} 
                brandName={item.brand?.name} 
              />
            </div>
            <div>
              <h4 className="font-medium text-lg">{item.description}</h4>
              <p className="text-sm text-gray-500">{item.brand?.name}</p>
              {item.equipmentSpecs?.price && (
                <p className="text-sm text-gold font-medium mt-1">{item.equipmentSpecs.price}</p>
              )}
              <div className="flex gap-2 items-center mt-1">
                {item.relationshipStartYear && (
                  <p className="text-xs text-gray-400">Partnership since {item.relationshipStartYear}</p>
                )}
                {item.equipmentSpecs?.purchaseLink && (
                  <a 
                    href={item.equipmentSpecs.purchaseLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-gold hover:underline"
                  >
                    Buy Now
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}