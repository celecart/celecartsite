import { storage } from "./storage";
import { Celebrity } from "@shared/schema";

// This function manually adds Tom Cruise to the database
export async function addTomCruiseToDB() {
  try {
    // Check if Tom Cruise already exists
    const celebritiesArray = await storage.getCelebrities();
    const tomExists = celebritiesArray.some(celeb => celeb.name === "Tom Cruise");
    
    if (!tomExists) {
      console.log("Adding Tom Cruise to the database...");
      
      const tom: Celebrity = {
        id: 20,
        name: "Tom Cruise",
        profession: "Actor, Producer",
        imageUrl: "/assets/tom-cruise/profile.jpg",
        description: "American actor and producer known for his roles in iconic films like Top Gun, Mission: Impossible, and Jerry Maguire. Famous for his high-energy performances, stunt work, and signature aviator sunglasses that became a fashion statement.",
        category: "Hollywood",
        managerInfo: {
          name: "Creative Artists Agency",
          agency: "CAA",
          email: "contact@caa.com",
          phone: "+1 424 288 2000",
          bookingInquiries: "For business inquiries, sponsorships, and collaborations, please contact CAA with detailed proposal information."
        },
        stylingDetails: [
          {
            occasion: "Top Gun Style",
            outfit: {
              designer: "Ray-Ban",
              price: "$179-$219",
              details: "Iconic Ray-Ban RB3025 Aviator sunglasses, the signature look from Top Gun that influenced men's fashion for decades and remains a classic accessory"
            },
            image: "/assets/tom-cruise/aviators.jpg"
          },
          {
            occasion: "Top Gun Pilot Jacket",
            outfit: {
              designer: "Schott NYC",
              price: "$850-$1,200",
              details: "Authentic G-1 style leather flight jacket with shearling collar, similar to the iconic jacket worn by Tom Cruise as Maverick in Top Gun. Features patch details and weathered leather for that authentic naval aviator look."
            },
            image: "/assets/tom-cruise/pilot-jacket.jpg"
          },
          {
            occasion: "Red Carpet",
            outfit: {
              designer: "Tom Ford, Giorgio Armani",
              price: "Custom",
              details: "Perfectly tailored black tuxedos and suits with classic styling and minimal accessories, emphasizing clean, elegant silhouettes"
            },
            image: "/assets/tom-cruise/redcarpet.jpg"
          },
          {
            occasion: "Mission Impossible Style",
            outfit: {
              designer: "Custom Activewear",
              price: "Custom",
              details: "Sleek, form-fitting tactical wear featuring dark colors, specialized materials for movement, and practical accessories for action sequences"
            },
            image: "/assets/tom-cruise/mission.jpg"
          }
        ]
      };
      
      // Manually add to storage's internal map
      (storage as any).celebrities.set(tom.id, tom);
      
      console.log("Tom Cruise successfully added to the database!");
    } else {
      console.log("Tom Cruise already exists in the database");
    }
  } catch (error) {
    console.error("Error adding Tom Cruise to database:", error);
  }
}