import { storage } from "./storage";
import { Brand, CelebrityBrand } from "../shared/schema";

export async function addRandolphBrandToDB() {
  try {
    // Check if Randolph brand already exists
    const existingBrands = await storage.getBrands();
    const randolphBrand = existingBrands.find(brand => brand.name === "Randolph Engineering");
    
    if (!randolphBrand) {
      // Create Randolph brand
      const randolph: Brand = {
        id: 81, // Using next available ID
        name: "Randolph Engineering",
        description: "American heritage eyewear brand known for manufacturing military-spec aviator sunglasses for the U.S. military since 1982. Renowned for exceptional optical quality, durability, and timeless design.",
        imageUrl: "/assets/brands/randolph-logo.jpg",
        celebWearers: ["Tom Cruise", "US Military Pilots"]
      };
      
      // Add to storage
      await storage.createBrand(randolph);
      
      // Create association with Tom Cruise
      const tomCruiseRandolph: CelebrityBrand = {
        id: 202, // Using next available ID
        celebrityId: 22, // Tom Cruise's ID
        brandId: 81, // Randolph Engineering ID
        description: "Military-spec aviator sunglasses worn by Tom Cruise in various films and public appearances. Favored for their authentic military heritage and premium build quality.",
        itemType: "Sunglasses",
        categoryId: 4, // Accessories
        imagePosition: { top: "40%", left: "50%" },
        equipmentSpecs: {
          material: "Handcrafted metal frame with glass lenses",
          color: "23k Gold with AGX Green lenses",
          releaseYear: 1982,
          price: "$329.00",
          purchaseLink: "https://www.randolphusa.com/products/aviator-military-special-edition-23k-gold?_pos=9&_fid=2ff7ee0f4&_ss=c",
          stockStatus: "Available",
          size: "55mm, 58mm lens options",
          ratings: {
            quality: 5,
            style: 5,
            value: 4
          }
        },
        occasionPricing: {
          "standard": {
            price: "$329.00",
            availableColors: ["23k Gold/AGX Green", "Gun Metal/Gray", "Matte Black/Gray"]
          },
          "polarized": {
            price: "$379.00", 
            availableColors: ["23k Gold/AGX Green Polarized", "Gun Metal/Gray Polarized"],
            customOptions: ["Polarized lenses"]
          },
          "special edition": {
            price: "$429.00",
            availableColors: ["23k Gold with American Gray"],
            customOptions: ["Military special edition", "Bayonet temples"],
            limitedEdition: true
          }
        },
        relationshipStartYear: 2022,
        grandSlamAppearances: []
      };
      
      // Add to storage
      await storage.createCelebrityBrand(tomCruiseRandolph);
      
      console.log("Randolph Engineering brand successfully added to the database!");
      console.log("Tom Cruise's Randolph Aviators successfully added to the database!");
    } else {
      console.log("Randolph Engineering brand already exists in the database");
      
      // Check if Tom Cruise's association with Randolph already exists
      const celebrityBrands = await storage.getCelebrityBrands(22); // Tom Cruise's ID
      const existingAssociation = celebrityBrands.find(cb => cb.brandId === randolphBrand.id);
      
      if (!existingAssociation) {
        // Create association with Tom Cruise
        const tomCruiseRandolph: CelebrityBrand = {
          id: 202, // Using next available ID
          celebrityId: 20, // Tom Cruise's ID
          brandId: randolphBrand.id,
          description: "Military-spec aviator sunglasses worn by Tom Cruise in various films and public appearances. Favored for their authentic military heritage and premium build quality.",
          itemType: "Sunglasses",
          categoryId: 4, // Accessories
          imagePosition: { top: "40%", left: "50%" },
          equipmentSpecs: {
            material: "Handcrafted metal frame with glass lenses",
            color: "23k Gold with AGX Green lenses",
            releaseYear: 1982,
            price: "$329.00",
            purchaseLink: "https://www.randolphusa.com/products/aviator-military-special-edition-23k-gold?_pos=9&_fid=2ff7ee0f4&_ss=c",
            stockStatus: "Available",
            size: "55mm, 58mm lens options",
            ratings: {
              quality: 5,
              style: 5,
              value: 4
            }
          },
          occasionPricing: {
            "standard": {
              price: "$329.00",
              availableColors: ["23k Gold/AGX Green", "Gun Metal/Gray", "Matte Black/Gray"]
            },
            "polarized": {
              price: "$379.00", 
              availableColors: ["23k Gold/AGX Green Polarized", "Gun Metal/Gray Polarized"],
              customOptions: ["Polarized lenses"]
            },
            "special edition": {
              price: "$429.00",
              availableColors: ["23k Gold with American Gray"],
              customOptions: ["Military special edition", "Bayonet temples"],
              limitedEdition: true
            }
          },
          relationshipStartYear: 2022,
          grandSlamAppearances: []
        };
        
        // Add to storage
        await storage.createCelebrityBrand(tomCruiseRandolph);
        
        console.log("Tom Cruise's Randolph Aviators successfully added to the database!");
      } else {
        console.log("Tom Cruise's Randolph association already exists in the database");
      }
    }
  } catch (error) {
    console.error("Error adding Randolph brand to database:", error);
  }
}