import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Instagram, 
  ExternalLink, 
  Scissors, 
  Paintbrush, 
  Store,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Types for styling details
interface StylingArtist {
  name: string;
  instagram?: string;
  website?: string;
  details?: string;
}

interface OutfitDetails {
  designer: string;
  price: string;
  details: string;
  purchaseLink?: string;
}

interface LookDetails {
  occasion: string;
  outfit: OutfitDetails;
  hairStylist?: StylingArtist;
  makeupArtist?: StylingArtist;
  image?: string;
}

interface StylingDetailsProps {
  looks: LookDetails[];
  className?: string;
}

export default function StylingDetails({ looks, className = "" }: StylingDetailsProps) {
  if (!looks || looks.length === 0) {
    return null;
  }

  return (
    <Card className={`mt-6 overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-50">
        <CardTitle className="text-xl font-playfair">Celebrity Styling Details</CardTitle>
        <CardDescription>
          Exclusive information about outfits, hair styling, and makeup
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs defaultValue={looks[0].occasion} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            {looks.map((look, index) => (
              <TabsTrigger key={index} value={look.occasion} className="text-sm">
                {look.occasion}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {looks.map((look, index) => (
            <TabsContent key={index} value={look.occasion} className="space-y-6">
              {look.image && (
                <div className="w-full rounded-lg overflow-hidden">
                  <img 
                    src={look.image} 
                    alt={look.occasion} 
                    className="w-full object-cover h-64"
                  />
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Outfit Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold text-lg">Outfit Details</h3>
                  </div>
                  
                  <div className="pl-7 space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Designer:</span>
                      <p className="font-medium">{look.outfit.designer}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Price:</span>
                      <p className="font-medium">{look.outfit.price}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Details:</span>
                      <p>{look.outfit.details}</p>
                    </div>
                    
                    {look.outfit.purchaseLink && (
                      <div className="mt-4">
                        <Button 
                          variant="default" 
                          className="bg-gold hover:bg-gold/90 text-dark" 
                          size="sm"
                          asChild
                        >
                          <a 
                            href={look.outfit.purchaseLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Shop this look</span>
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Hair and Makeup */}
                <div className="space-y-6">
                  {look.hairStylist && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Scissors className="h-5 w-5 text-amber-600" />
                        <h3 className="font-semibold">Hair by {look.hairStylist.name}</h3>
                      </div>
                      
                      <div className="pl-7">
                        <p className="text-sm mb-2">{look.hairStylist.details}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {look.hairStylist.instagram && (
                            <Button variant="outline" size="sm" asChild>
                              <a 
                                href={`https://instagram.com/${look.hairStylist.instagram}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <Instagram className="h-4 w-4" />
                                <span>@{look.hairStylist.instagram}</span>
                              </a>
                            </Button>
                          )}
                          
                          {look.hairStylist.website && (
                            <Button variant="outline" size="sm" asChild>
                              <a 
                                href={look.hairStylist.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span>Website</span>
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {look.makeupArtist && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Paintbrush className="h-5 w-5 text-amber-600" />
                        <h3 className="font-semibold">Makeup by {look.makeupArtist.name}</h3>
                      </div>
                      
                      <div className="pl-7">
                        <p className="text-sm mb-2">{look.makeupArtist.details}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {look.makeupArtist.instagram && (
                            <Button variant="outline" size="sm" asChild>
                              <a 
                                href={`https://instagram.com/${look.makeupArtist.instagram}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <Instagram className="h-4 w-4" />
                                <span>@{look.makeupArtist.instagram}</span>
                              </a>
                            </Button>
                          )}
                          
                          {look.makeupArtist.website && (
                            <Button variant="outline" size="sm" asChild>
                              <a 
                                href={look.makeupArtist.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span>Website</span>
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}