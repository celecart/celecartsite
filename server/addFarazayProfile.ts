import { storage } from './storage';

export async function addFrazayAkbarProfileToDB() {
  try {
    // Check if Frazay already exists
    const celebritiesArray = await storage.getCelebrities();
    
    const existingFrazay = celebritiesArray.find(celeb => celeb.name === "Frazay Akbar");
    
    const stylingDetails = [
        {
          occasion: "Wedding Ceremony - Grand Bridal",
          outfit: {
            designer: "HSY",
            price: "Price on Request",
            details: "Raspberry Red Shirt & Trail Lehanga Set - A majestic bridal ensemble featuring intricate embroidery, premium fabrics, and traditional silhouettes perfect for the main wedding ceremony",
            purchaseLink: "https://theworldofhsy.com/products/raspberry-red-shirt-trail-lehanga-set"
          },
          image: "/assets/frazay-akbar/raspberry-red-bridal.jpg"
        },
        {
          occasion: "Walima Reception - Royal Elegance",
          outfit: {
            designer: "HSY",
            price: "Price on Request",
            details: "Irish Purple Gown with Lehanga & Dupatta - An ethereal combination of contemporary gown styling with traditional lehenga, perfect for reception ceremonies",
            purchaseLink: "https://theworldofhsy.com/products/irish-purple-gown-with-lehanga-dupatta-copy"
          },
          image: "/assets/frazay-akbar/irish-purple-gown.jpg"
        },
        {
          occasion: "Mehndi Celebration - Traditional Grace",
          outfit: {
            designer: "HSY",
            price: "Price on Request",
            details: "Maroon Choli Lehanga Set with Mukesh Dupatta - Rich maroon ensemble with intricate mukesh work, embodying traditional Pakistani bridal aesthetics",
            purchaseLink: "https://theworldofhsy.com/products/maroon-choli-lehenga-with-mukesh-dupatta-copy"
          },
          image: "/assets/frazay-akbar/maroon-choli-lehenga.jpg"
        },
        {
          occasion: "Nikah Ceremony - Elegant Simplicity",
          outfit: {
            designer: "HSY",
            price: "Price on Request",
            details: "Red Front Open Shirt with Azaar Pants - A sophisticated take on traditional bridal wear with modern silhouettes and timeless elegance",
            purchaseLink: "https://theworldofhsy.com/products/red-front-open-shirt-with-azaar-pants"
          },
          image: "/assets/frazay-akbar/red-front-open.jpg"
        },
        {
          occasion: "Baraat Reception - Regal Splendor",
          outfit: {
            designer: "HSY",
            price: "Price on Request",
            details: "Rust Orange Pishwas & Jamawar Lehanga Set - A stunning fusion of classic pishwas styling with luxurious jamawar fabric, perfect for grand celebrations",
            purchaseLink: "https://theworldofhsy.com/products/deluxe-04-rust-orange-pishwas-jamawar-lehanga-set"
          },
          image: "/assets/frazay-akbar/rust-orange-pishwas.jpg"
        },
        {
          occasion: "Summer Resort Elegance",
          outfit: {
            designer: "Sana Safinaz",
            price: "Rs.33,548.90",
            details: "Digital Printed Herringbone Resort Set - Perfect for luxury resort getaways with sophisticated front-open styling and premium herringbone fabric",
            purchaseLink: "https://sanasafinaz.com/products/stitched-resort-set-rc25-007p2t"
          },
          image: "/assets/frazay-akbar/sana-safinaz-resort-herringbone.jpg"
        },
        {
          occasion: "Casual Chic Ensemble",
          outfit: {
            designer: "Sana Safinaz",
            price: "Rs.31,348.90",
            details: "Easy breezy herringbone set with T-shirt styling and culottes - Perfect for relaxed luxury occasions",
            purchaseLink: "https://sanasafinaz.com/products/stitched-resort-shirt-plus-bottom-rc25-013p2t"
          },
          image: "/assets/frazay-akbar/sana-safinaz-tshirt-culottes.jpg"
        },
        {
          occasion: "Pretty Holiday Routine",
          outfit: {
            designer: "Sana Safinaz",
            price: "Rs.45,978.90",
            details: "Pink lawn co-ord set with front-open jacket and culottes - Your prettiest holiday ensemble for special getaway moments",
            purchaseLink: "https://sanasafinaz.com/products/stitched-resort-co-ord-rc25-015p2t"
          },
          image: "/assets/frazay-akbar/sana-safinaz-pink-coord.jpg"
        },
        {
          occasion: "Golden Hour Sophistication",
          outfit: {
            designer: "Sana Safinaz",
            price: "Rs.33,548.90",
            details: "Digital printed herringbone jacket set with culottes - Made for golden hours and sophisticated resort styling",
            purchaseLink: "https://sanasafinaz.com/products/stitched-resort-set-rc25-019p2t"
          },
          image: "/assets/frazay-akbar/sana-safinaz-herringbone-jacket.jpg"
        },
        {
          occasion: "Sunkissed Coordination",
          outfit: {
            designer: "Sana Safinaz",
            price: "Rs.46,528.90",
            details: "Lemon yellow lawn co-ord with front-open styling - Sunkissed and perfectly coordinated for golden hour getaways",
            purchaseLink: "https://sanasafinaz.com/products/stitched-resort-co-ord-rc25-020p2t"
          },
          image: "/assets/frazay-akbar/sana-safinaz-lemon-coord.jpg"
        },
        {
          occasion: "Elegant Daywear",
          outfit: {
            designer: "Agha Noor",
            price: "USD $50",
            details: "Cream embroidered lawn 3-piece suit with intricate embellishments - Perfect for sophisticated daytime events and casual elegance",
            purchaseLink: "https://shop.aghanoorofficial.com/products/3-piece-embroidered-lawn-suit-s112257"
          },
          image: "/assets/frazay-akbar/agha-noor-embroidered-lawn-suit-s112257.jpg"
        },
        {
          occasion: "Formal Evening Elegance",
          outfit: {
            designer: "Agha Noor",
            price: "USD $96",
            details: "Mint green pure embroidered organza 3-piece suit with premium fabric and detailed embroidery - Ideal for formal dinners and evening events",
            purchaseLink: "https://shop.aghanoorofficial.com/products/3-piece-pure-embroidered-organza-suit-s112183"
          },
          image: "/assets/frazay-akbar/agha-noor-organza-suit-s112183.jpg"
        },
        {
          occasion: "Premium Party Wear",
          outfit: {
            designer: "Agha Noor",
            price: "USD $103",
            details: "Ice blue pure embroidered organza 3-piece suit featuring luxurious organza fabric with stunning embroidered details",
            purchaseLink: "https://shop.aghanoorofficial.com/products/3-piece-pure-embroidered-organza-suit-s112186"
          },
          image: "/assets/frazay-akbar/agha-noor-organza-suit-s112186.jpg"
        },
        {
          occasion: "Refined Silk Sophistication",
          outfit: {
            designer: "Agha Noor",
            price: "USD $57",
            details: "Off white pure embroidered chameuse silk 2-piece suit with luxurious silk fabric and elegant embroidered detailing",
            purchaseLink: "https://shop.aghanoorofficial.com/products/2-piece-pure-embroidered-chameuse-silk-suit-s112237"
          },
          image: "/assets/frazay-akbar/agha-noor-silk-suit-s112237.jpg"
        },
        {
          occasion: "Contemporary Chic",
          outfit: {
            designer: "Agha Noor",
            price: "USD $71",
            details: "Black pure embroidered cotton net 3-piece suit combining modern styling with traditional embroidery techniques",
            purchaseLink: "https://shop.aghanoorofficial.com/products/3-piece-pure-embroidered-cotton-net-suit-s112238"
          },
          image: "/assets/frazay-akbar/agha-noor-cotton-net-suit-s112238.jpg"
        }
      ];

      const profileData = {
        name: "Frazay Akbar",
        profession: "Fashion Influencer, Social Media Personality",
        imageUrl: "/assets/frazay-akbar/profile.jpg",
        description: "Pakistani fashion influencer and social media personality known for her distinctive style content and fashion collaborations. Frazay Akbar creates engaging fashion content, showcasing everything from bridal couture to resort wear, and has built a strong following through her authentic style approach and collaborations with top Pakistani designers like HSY and Sana Safinaz.",
        category: "Fashion",
        managerInfo: {
          name: "Frazay Akbar Management",
          agency: "Elite Fashion Influencers",
          email: "collaborations@frazayakbar.com",
          phone: "+92 321 7777 890",
          bookingInquiries: "For fashion collaborations, brand partnerships, and styling consultations, contact Frazay Akbar Management for booking inquiries."
        },
        stylingDetails: stylingDetails
      };

      if (existingFrazay) {
        // Update existing profile with correct styling details
        console.log("Updating Frazay Akbar profile with styling details (5 HSY bridal + 5 Sana Safinaz resort + 5 Agha Noor pieces)...");
        await storage.updateCelebrity(existingFrazay.id, profileData);
        console.log("Frazay Akbar profile successfully updated with 15 styling details!");
      } else {
        // Create new profile
        console.log("Adding Frazay Akbar (Fashion Influencer, Social Media Personality) to the database...");
        await storage.createCelebrity(profileData);
        console.log("Frazay Akbar successfully added to the database!");
      }
  } catch (error) {
    console.error("Error adding Frazay Akbar to database:", error);
  }
}