import { storage } from "./storage";
import { Celebrity } from "@shared/schema";

// This function manually adds Taylor Swift to the database
export async function addTaylorSwiftToDB() {
  try {
    // Check if Taylor Swift already exists
    const celebritiesArray = await storage.getCelebrities();
    const taylorExists = celebritiesArray.some(celeb => celeb.name === "Taylor Swift");
    
    if (!taylorExists) {
      console.log("Adding Taylor Swift to the database...");
      
      const taylor: Celebrity = {
        id: 10,
        name: "Taylor Swift",
        profession: "Singer-Songwriter, Musician, Actress",
        imageUrl: "/assets/taylor-swift/profile.jpg",
        description: "American singer-songwriter known for narrative songs about her personal life. One of the world's best-selling music artists, she has received numerous accolades including 11 Grammy Awards. Her fashion evolution has inspired millions of fans worldwide.",
        category: "Music",
        managerInfo: {
          name: "Taylor Swift Management",
          agency: "Republic Records",
          email: "contact@taylorswift.com",
          phone: "+1 310 555 1989",
          bookingInquiries: "For business inquiries, sponsorships, and collaborations, please contact Taylor Swift Management with detailed proposal information."
        },
        stylingDetails: [
          {
            occasion: "Eras Tour",
            outfit: {
              designer: "Roberto Cavalli, Versace, Alberta Ferretti",
              price: "Custom",
              details: "Elaborate stage costumes representing different musical eras, featuring sequins, fringe, and vibrant colors"
            },
            image: "/assets/taylor-swift/eras.jpg"
          },
          {
            occasion: "Red Carpet",
            outfit: {
              designer: "Etro, Oscar de la Renta, Zuhair Murad",
              price: "Custom",
              details: "Elegant gowns with intricate detailing, often incorporating her signature red or sparkling embellishments"
            },
            image: "/assets/taylor-swift/redcarpet.jpg"
          }
        ]
      };
      
      // Manually add to storage's internal map
      (storage as any).celebrities.set(taylor.id, taylor);
      
      console.log("Taylor Swift successfully added to the database!");
    } else {
      console.log("Taylor Swift already exists in the database");
    }
  } catch (error) {
    console.error("Error adding Taylor Swift to database:", error);
  }
}