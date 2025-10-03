import { storage } from "./storage";

export async function markEliteCelebrities() {
  try {
    console.log("Marking elite celebrities...");
    
    // Get all celebrities
    const celebrities = await storage.getCelebrities();
    
    // Define elite celebrity names - international superstars and global icons
    const eliteCelebrityNames = [
      "Priyanka Chopra",
      "Kim Kardashian", 
      "Katrina Kaif",
      "Ariana Grande",
      "Aishwarya Rai Bachchan",
      "Mehwish Hayat",
      "Mahira Khan",
      "Fawad Khan",
      "Atif Aslam",
      "Hania Amir"
    ];
    
    // Mark celebrities as elite
    for (const celebrity of celebrities) {
      if (eliteCelebrityNames.includes(celebrity.name)) {
        // Update celebrity with elite status
        const updatedCelebrity = {
          name: celebrity.name,
          profession: celebrity.profession,
          imageUrl: celebrity.imageUrl,
          description: celebrity.description,
          category: celebrity.category,
          isElite: true,
          managerInfo: celebrity.managerInfo,
          stylingDetails: celebrity.stylingDetails
        };
        
        // Update in storage (replace the celebrity)
        await storage.updateCelebrity(celebrity.id, updatedCelebrity);
        console.log(`Marked ${celebrity.name} as ELITE celebrity`);
      }
    }
    
    console.log("Elite celebrity marking completed!");
  } catch (error) {
    console.error("Error marking elite celebrities:", error);
  }
}