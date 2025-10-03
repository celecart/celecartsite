import { storage } from "./storage";
import { Celebrity } from "@shared/schema";

export async function addPakistaniCelebritiesToDB() {
  try {
    // Check if these celebrities already exist
    const celebritiesArray = await storage.getCelebrities();
    
    // Add Bilawal Bhutto Zardari
    const bilawalExists = celebritiesArray.some(celeb => celeb.name === "Bilawal Bhutto Zardari");
    if (!bilawalExists) {
      console.log("Adding Bilawal Bhutto Zardari to the database...");
      
      const stylingDetails = [
        {
          occasion: "Political Rallies",
          outfit: {
            designer: "Custom Pakistani Tailoring",
            price: "Custom",
            details: "Traditional Pakistani formal shirts (kurta) with waistcoats, featuring subtle embroidery and premium fabrics in party colors"
          },
          image: "/assets/bilawal-bhutto/rally.jpg"
        },
        {
          occasion: "International Diplomacy",
          outfit: {
            designer: "Charcoal, Bonanza Satrangi",
            price: "$800-$2,000",
            details: "Sophisticated business suits in navy and charcoal, perfectly tailored with silk ties and leather dress shoes for diplomatic meetings"
          },
          image: "/assets/bilawal-bhutto/diplomatic.jpg"
        },
        {
          occasion: "Traditional Events",
          outfit: {
            designer: "Junaid Jamshed, Republic",
            price: "$200-$500",
            details: "Elegant shalwar kameez sets in cream and white with gold accents, representing Pakistani cultural heritage"
          },
          image: "/assets/bilawal-bhutto/traditional.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Bilawal Bhutto Zardari",
        profession: "Politician, Chairman Pakistan People's Party",
        imageUrl: "/assets/bilawal-bhutto/profile.jpg",
        description: "Pakistani politician and current Chairman of the Pakistan People's Party (PPP). Known for his sophisticated fashion sense, often seen in tailored suits and traditional Pakistani formal wear. Son of former Prime Minister Benazir Bhutto.",
        category: "Politics",
        managerInfo: {
          name: "Pakistan People's Party",
          agency: "PPP Media Office",
          email: "media@ppp.org.pk",
          phone: "+92 21 99201493",
          bookingInquiries: "For official inquiries and media requests, please contact PPP Media Office with formal documentation."
        },
        stylingDetails: stylingDetails
      });
      
      console.log("Bilawal Bhutto Zardari successfully added to the database!");
    }

    // Add Junaid Safdar
    const junaidExists = celebritiesArray.some(celeb => celeb.name === "Junaid Safdar");
    if (!junaidExists) {
      console.log("Adding Junaid Safdar to the database...");
      
      const junaidStylingDetails = [
        {
          occasion: "Business Meetings",
          outfit: {
            designer: "Hugo Boss, Charcoal",
            price: "$1,200-$3,000",
            details: "Contemporary business suits in navy and grey, with modern cuts and premium fabrics, accessorized with luxury watches"
          },
          image: "/assets/junaid-safdar/business.jpg"
        },
        {
          occasion: "Social Events",
          outfit: {
            designer: "Deepak Perwani, HSY",
            price: "$500-$1,500",
            details: "Designer sherwanis and formal kurtas with contemporary styling, featuring subtle embellishments and modern silhouettes"
          },
          image: "/assets/junaid-safdar/social.jpg"
        },
        {
          occasion: "Casual Outings",
          outfit: {
            designer: "Polo Ralph Lauren, Tommy Hilfiger",
            price: "$200-$800",
            details: "Smart casual wear including polo shirts, chinos, and blazers in neutral tones with modern accessories"
          },
          image: "/assets/junaid-safdar/casual.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Junaid Safdar",
        profession: "Entrepreneur, Political Figure",
        imageUrl: "/assets/junaid-safdar/profile.jpg",
        description: "Pakistani entrepreneur and political figure, grandson of former Prime Minister Nawaz Sharif. Known for his modern fashion sense, blending contemporary Western wear with traditional Pakistani styling.",
        category: "Politics",
        managerInfo: {
          name: "Safdar Family Office",
          agency: "Private Management",
          email: "contact@safdarfamily.pk",
          phone: "+92 42 99203456",
          bookingInquiries: "For business and media inquiries, please contact through official family office channels."
        },
        stylingDetails: junaidStylingDetails
      });
      
      console.log("Junaid Safdar successfully added to the database!");
    }

    // Add Sana Safinaz (as a fashion brand/personality)
    const sanaExists = celebritiesArray.some(celeb => celeb.name === "Sana Safinaz");
    if (!sanaExists) {
      console.log("Adding Sana Safinaz to the database...");
      
      const sanaStylingDetails = [
        {
          occasion: "Luxury Collection Launch",
          outfit: {
            designer: "Sana Safinaz Couture",
            price: "$2,000-$8,000",
            details: "Signature couture pieces featuring intricate hand embroidery, premium fabrics, and contemporary silhouettes that define Pakistani luxury fashion"
          },
          image: "/assets/sana-safinaz/couture.jpg"
        },
        {
          occasion: "Fashion Week",
          outfit: {
            designer: "Sana Safinaz Ready-to-Wear",
            price: "$300-$1,200",
            details: "Modern pret collections with bold prints, contemporary cuts, and vibrant colors that represent the brand's innovative approach to traditional wear"
          },
          image: "/assets/sana-safinaz/fashion-week.jpg"
        },
        {
          occasion: "Celebrity Styling",
          outfit: {
            designer: "Sana Safinaz Custom",
            price: "Custom",
            details: "Bespoke outfits created for celebrities and high-profile clients, featuring unique designs, luxury embellishments, and perfect tailoring"
          },
          image: "/assets/sana-safinaz/celebrity.jpg"
        }
      ];

      await storage.createCelebrity({
        name: "Sana Safinaz",
        profession: "Fashion Designer Duo, Creative Directors",
        imageUrl: "/assets/sana-safinaz/profile.jpg",
        description: "Renowned Pakistani fashion designer duo Sana Hashwani and Safinaz Muneer. Known for their luxury fashion brand offering contemporary and traditional wear. Their signature style combines modern aesthetics with traditional Pakistani craftsmanship.",
        category: "Fashion",
        managerInfo: {
          name: "Sana Safinaz Design House",
          agency: "SS Fashion House",
          email: "info@sanasafinaz.com",
          phone: "+92 21 35861522",
          bookingInquiries: "For fashion collaborations, custom orders, and media inquiries, please contact Sana Safinaz Design House."
        },
        stylingDetails: sanaStylingDetails
      });
      
      console.log("Sana Safinaz successfully added to the database!");
    }

  } catch (error) {
    console.error("Error adding Pakistani celebrities to database:", error);
  }
}