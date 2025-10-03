import React, { useState } from 'react';
import { CelebrityBrand } from '@shared/schema';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CelebrityBrandWithDetails } from "@/pages/CelebrityProfile";

interface OccasionPricingProps {
  item: CelebrityBrandWithDetails | CelebrityBrand;
  className?: string;
}

export default function OccasionPricing({ item, className = "" }: OccasionPricingProps) {
  const [activeOccasion, setActiveOccasion] = useState<string | null>(
    item.occasionPricing ? Object.keys(item.occasionPricing)[0] : null
  );

  if (!item.occasionPricing || Object.keys(item.occasionPricing).length === 0) {
    return null;
  }

  const occasions = Object.keys(item.occasionPricing);
  
  return (
    <Card className={`mt-6 overflow-hidden ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Pricing Options</CardTitle>
        <CardDescription>
          Select an occasion to see specific pricing information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={occasions[0]} className="w-full" onValueChange={setActiveOccasion}>
          <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4">
            {occasions.map((occasion) => (
              <TabsTrigger key={occasion} value={occasion} className="capitalize">
                {occasion}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {occasions.map((occasion) => {
            const pricingInfo = item.occasionPricing?.[occasion];
            
            return (
              <TabsContent key={occasion} value={occasion} className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium capitalize">{occasion} Price</h3>
                    <span className="text-xl font-bold">{pricingInfo?.price}</span>
                  </div>
                  
                  {pricingInfo?.discount && (
                    <div className="flex items-center text-green-600">
                      <Badge variant="outline" className="bg-green-50 mr-2">DISCOUNT</Badge>
                      {pricingInfo.discount}
                    </div>
                  )}
                  
                  {pricingInfo?.availableColors && pricingInfo.availableColors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Available Colors</h4>
                      <div className="flex flex-wrap gap-2">
                        {pricingInfo.availableColors.map((color, idx) => (
                          <Badge key={idx} variant="secondary">{color}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {pricingInfo?.customOptions && pricingInfo.customOptions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Customization Options</h4>
                      <ul className="space-y-1">
                        {pricingInfo.customOptions.map((option, idx) => (
                          <li key={idx} className="flex items-center">
                            <Check size={16} className="mr-2 text-green-600" />
                            <span>{option}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {pricingInfo?.limitedEdition && (
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Star size={12} className="mr-1" /> Limited Edition
                      </Badge>
                    </div>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-muted/20 pt-4">
        <div>
          {item.equipmentSpecs?.ratings && (
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${
                    star <= Math.round(
                      (item.equipmentSpecs?.ratings?.quality || 0) +
                      (item.equipmentSpecs?.ratings?.comfort || 0) +
                      (item.equipmentSpecs?.ratings?.style || 0) +
                      (item.equipmentSpecs?.ratings?.value || 0)
                    ) / 4
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm">
                {item.equipmentSpecs?.ratings &&
                  ((
                    (item.equipmentSpecs.ratings.quality || 0) +
                    (item.equipmentSpecs.ratings.comfort || 0) +
                    (item.equipmentSpecs.ratings.style || 0) +
                    (item.equipmentSpecs.ratings.value || 0)
                  ) / 4)
                    .toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        {item.equipmentSpecs?.purchaseLink && (
          <Button size="sm" className="gap-1">
            <ShoppingCart size={16} /> Buy Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}