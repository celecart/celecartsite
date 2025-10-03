// server/services/openai.ts
// 🔹 Local-only stub, no OpenAI dependency

// ---------- Style analysis ----------
export async function analyzeStyle(
  celebrityProfile: any, 
  fashionChoices: any[]
): Promise<string> {
  return `⚡ Stub style analysis: ${celebrityProfile.name} (profession: ${celebrityProfile.profession}) 
  with choices: ${fashionChoices.map(i => i.itemType).join(", ")}`;
}

// ---------- Outfit recommendations ----------
export async function generateOutfitRecommendations(
  userPreferences: string, 
  celebrityName: string, 
  occasion: string
): Promise<string[]> {
  return [
    `⚡ Stub outfit 1 for ${celebrityName} on ${occasion} (prefs: ${userPreferences})`,
    `⚡ Stub outfit 2 for ${celebrityName}`,
    `⚡ Stub outfit 3 (local mode)`,
  ];
}

// ---------- Chatbot ----------
export async function getChatbotResponse(
  userQuestion: string, 
  conversationHistory: {role: 'system' | 'user' | 'assistant', content: string}[]
): Promise<string> {
  return `⚡ Stub chatbot response to: "${userQuestion}" (history length: ${conversationHistory.length})`;
}

// ---------- Image analysis ----------
export async function analyzeImageForSimilarOutfits(
  imageDescription: string
): Promise<any[]> {
  return [
    {
      celebrityName: "⚡ Stub Celebrity",
      confidence: 0.95,
      matchingElements: ["stub element 1", "stub element 2"],
      recommendedItems: ["stub item A", "stub item B"],
    },
  ];
}
