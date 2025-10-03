import { storage } from "./storage";
import { Brand, CelebrityBrand } from "@shared/schema";

export async function addSchottNYCBrandToDB() {
  try {
    // Check if Schott NYC already exists
    const brandsArray = await storage.getBrands();
    const schottExists = brandsArray.some(brand => brand.name === "Schott NYC");
    
    if (!schottExists) {
      console.log("Adding Schott NYC brand to the database...");
      
      const schott: Brand = {
        id: 81,
        name: "Schott NYC",
        description: "Iconic American outerwear manufacturer, known for creating the first leather motorcycle jacket and supplying flight jackets to the US military. Their G-1 leather flight jacket gained worldwide fame when worn by Tom Cruise in 'Top Gun'.",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        celebWearers: ["Tom Cruise"]
      };
      
      // Manually add to storage's internal map
      (storage as any).brands.set(schott.id, schott);
      
      console.log("Schott NYC brand successfully added to the database!");
    } else {
      console.log("Schott NYC brand already exists in the database");
    }
    
    // Check if Tom Cruise's Schott NYC association already exists
    const celebrityBrandsArray = await storage.getCelebrityBrands(22); // Tom Cruise's ID
    const schottAssociationExists = celebrityBrandsArray.some(cb => cb.brandId === 81);
    
    if (!schottAssociationExists) {
      console.log("Adding Tom Cruise's Top Gun Pilot Jacket to the database...");
      
      const tomCruiseJacket: CelebrityBrand = {
        id: 201,
        celebrityId: 22, // Tom Cruise's ID
        brandId: 81, // Schott NYC ID
        description: "Legendary G-1 flight jacket as worn by Tom Cruise in the role of Maverick in Top Gun. This iconic leather jacket with shearling collar became a cultural phenomenon and fashion statement after the film's release.",
        itemType: "Leather Jacket",
        categoryId: 2, // Outerwear
        imagePosition: { top: "40%", left: "50%" },
        equipmentSpecs: {
          material: "Premium cowhide leather with real shearling collar",
          color: "Dark brown/weathered finish",
          releaseYear: 1986,
          price: "$850-$1,200",
          purchaseLink: "https://www.schottnyc.com/products/g1-leather-jacket.htm",
          stockStatus: "Available",
          size: "XS to 3XL",
          ratings: {
            quality: 5,
            style: 5,
            value: 4
          }
        },
        occasionPricing: {
          "standard": {
            price: "$850",
            availableColors: ["Dark Brown", "Black"]
          },
          "vintage": {
            price: "$950", 
            availableColors: ["Distressed Brown"],
            customOptions: ["Pre-weathered finish"]
          },
          "collector": {
            price: "$1,200",
            availableColors: ["Authentic Replica Brown"],
            customOptions: ["Replica patches", "Aged finish", "Numbered edition"],
            limitedEdition: true
          }
        },
        relationshipStartYear: 1986,
        grandSlamAppearances: []
      };
      
      // Manually add to storage's internal map
      (storage as any).celebrityBrands.set(tomCruiseJacket.id, tomCruiseJacket);
      
      console.log("Tom Cruise's Top Gun Pilot Jacket successfully added to the database!");
    } else {
      console.log("Tom Cruise's Schott NYC association already exists in the database");
    }
  } catch (error) {
    console.error("Error adding Schott NYC brand to database:", error);
  }
}