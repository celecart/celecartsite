import BrandImage from "@/components/BrandImage";
import { CelebrityBrandWithDetails } from "@/pages/CelebrityProfile";

interface ApparelAccessoriesProps {
  items: CelebrityBrandWithDetails[];
}

export default function ApparelAccessories({ items }: ApparelAccessoriesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {items
        .filter((item) => 
          item.itemType !== 'Racquet' && 
          item.itemType !== 'Footwear' && 
          item.itemType !== 'Football Boots'
        )
        .map((item) => (
          <div 
            key={item.id} 
            className="relative rounded-xl overflow-hidden border border-purple-200 bg-neutral-100 bg-cover bg-center h-80"
            style={{ backgroundImage: `url(${item.brand?.imageUrl || '/placeholder.svg'})` }}
          >
            {item.relationshipStartYear && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Popular</div>
            )}
            {item.equipmentSpecs?.price && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">${item.equipmentSpecs.price}</div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h4 className="text-white font-medium text-lg">{item.brand?.name}</h4>
              <p className="text-white/80 text-sm">{item.itemType}</p>
            </div>
          </div>
        ))}
    </div>
  );
}