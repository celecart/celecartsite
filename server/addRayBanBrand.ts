import { storage } from "./storage";
import { Brand, CelebrityBrand } from "@shared/schema";

export async function addRayBanBrandToDB() {
  try {
    // Check if Ray-Ban already exists
    const brandsArray = await storage.getBrands();
    const rayBanExists = brandsArray.some(brand => brand.name === "Ray-Ban");
    
    if (!rayBanExists) {
      console.log("Adding Ray-Ban brand to the database...");
      
      const rayBan: Brand = {
        id: 80,
        name: "Ray-Ban",
        description: "Iconic American-Italian luxury eyewear brand known for their legendary Aviator sunglasses, which became synonymous with cool, classic style after being worn by Tom Cruise in 'Top Gun'.",
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        celebWearers: ["Tom Cruise"]
      };
      
      // Manually add to storage's internal map
      (storage as any).brands.set(rayBan.id, rayBan);
      
      console.log("Ray-Ban brand successfully added to the database!");
    } else {
      console.log("Ray-Ban brand already exists in the database");
    }
    
    // Check if Tom Cruise's Ray-Ban association already exists
    const celebrityBrandsArray = await storage.getCelebrityBrands(20); // Tom Cruise's ID
    const rayBanAssociationExists = celebrityBrandsArray.some(cb => cb.brandId === 80);
    
    if (!rayBanAssociationExists) {
      console.log("Adding Tom Cruise's Ray-Ban Aviator sunglasses to the database...");
      
      const tomCruiseRayBan: CelebrityBrand = {
        id: 200,
        celebrityId: 22, // Tom Cruise's ID
        brandId: 80, // Ray-Ban ID
        description: "Iconic Ray-Ban Aviator sunglasses, made famous by Tom Cruise in 'Top Gun' and his other film appearances. These classic shades defined an era of style.",
        itemType: "Sunglasses",
        categoryId: 4, // Accessories
        imagePosition: { top: "40%", left: "50%" },
        equipmentSpecs: {
          material: "Metal frame with glass lenses",
          color: "Gold frame with green lenses",
          releaseYear: 1937,
          price: "$179-$219",
          purchaseLink: "https://www.ray-ban.com/usa/sunglasses/aviator",
          stockStatus: "Available",
          size: "58mm, 62mm lens options",
          ratings: {
            quality: 5,
            style: 5,
            value: 4
          }
        },
        occasionPricing: {
          "classic": {
            price: "$179",
            availableColors: ["Gold/Green", "Black/Green", "Silver/Blue"]
          },
          "polarized": {
            price: "$219", 
            availableColors: ["Gold/Green Polarized", "Black/Green Polarized"],
            customOptions: ["Polarized lenses"]
          },
          "custom": {
            price: "$240+",
            availableColors: ["Various frame and lens combinations"],
            customOptions: ["Customizable colors", "Prescription options"],
            limitedEdition: true
          }
        },
        relationshipStartYear: 1986,
        grandSlamAppearances: []
      };
      
      // Manually add to storage's internal map
      (storage as any).celebrityBrands.set(tomCruiseRayBan.id, tomCruiseRayBan);
      
      console.log("Tom Cruise's Ray-Ban Aviators successfully added to the database!");
    } else {
      console.log("Tom Cruise's Ray-Ban association already exists in the database");
    }
  } catch (error) {
    console.error("Error adding Ray-Ban brand to database:", error);
  }
}