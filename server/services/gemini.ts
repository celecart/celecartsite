import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client with the environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Configure the model
const getGeminiModel = () => {
  // Try using the standard gemini model for API v1beta
  return genAI.getGenerativeModel({ model: "gemini-pro" });
}

// Style analysis service
export async function analyzeStyle(celebrityProfile: any, fashionChoices: any[]): Promise<string> {
  try {
    const model = getGeminiModel();
    
    const prompt = `You are a fashion analyst specialized in celebrity style. Provide thoughtful, concise analysis.
      
      Analyze the style profile of ${celebrityProfile.name}, who is a ${celebrityProfile.profession}. 
      Their typical choices include: ${fashionChoices.map(item => 
      `${item.brand?.name || 'Unknown brand'} ${item.itemType} (${item.description})`).join(', ')}.
      
      What defines their signature style? What makes their fashion choices unique? Keep it under 200 words.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text || 'Style analysis unavailable at this time.';
  } catch (error) {
    console.error('Style analysis error:', error);
    return 'Style analysis unavailable at this time. Please try again later.';
  }
}

// Outfit recommendations service
export async function generateOutfitRecommendations(
  userPreferences: string, 
  celebrityName: string, 
  occasion: string
): Promise<string[]> {
  try {
    const model = getGeminiModel();
    
    const prompt = `You are a fashion stylist who creates outfit recommendations based on celebrity styles.
      
      Create 3 outfit recommendations inspired by ${celebrityName}'s style for ${occasion}.
      User preferences: ${userPreferences}
      Format each recommendation as a bullet point starting with a dash (-).`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    // Parse the bullet points
    return content.split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());
  } catch (error) {
    console.error('Outfit recommendation error:', error);
    return ['Unable to generate recommendations at this time. Please try again later.'];
  }
}

// Chatbot response service
export async function getChatbotResponse(
  userQuestion: string, 
  conversationHistory: {role: 'system' | 'user' | 'assistant', content: string}[]
): Promise<string> {
  try {
    const model = getGeminiModel();
    
    // Prepare conversation history for Gemini format
    let historyString = '';
    
    conversationHistory.forEach(msg => {
      if (msg.role === 'system') {
        historyString += `System instruction: ${msg.content}\n\n`;
      } else if (msg.role === 'user') {
        historyString += `User: ${msg.content}\n\n`;
      } else if (msg.role === 'assistant') {
        historyString += `Assistant: ${msg.content}\n\n`;
      }
    });
    
    const prompt = `${historyString}
    
    You are a helpful fashion assistant specialized in celebrity sportswear and brand partnerships. 
    Answer questions concisely and accurately. Your knowledge is focused on tennis, boxing, and soccer 
    athletes, their equipment, and sponsorships.
    
    User: ${userQuestion}
    
    Assistant:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text || 'I couldn\'t find an answer to that question.';
  } catch (error) {
    console.error('Chatbot response error:', error);
    return 'I\'m having trouble processing your request. Please try again later.';
  }
}

// Image similarity analysis
export async function analyzeImageForSimilarOutfits(imageDescription: string): Promise<any[]> {
  try {
    const model = getGeminiModel();
    
    const prompt = `You are a fashion image analyzer. Based on image descriptions, identify key style elements and potential matching celebrity outfits.
    
      Based on this image description: "${imageDescription}", 
      identify which sports celebrities might wear similar outfits or styles. 
      
      Format your response as JSON with an array of results that includes celebrityName, confidence score (0-1), matching elements, and recommended items.
      Include 2-3 results maximum.
      
      Example format:
      {
        "similarOutfits": [
          {
            "celebrityName": "Rafael Nadal",
            "confidence": 0.85,
            "matchingElements": ["bright colors", "athletic fit", "performance fabrics"],
            "recommendedItems": ["Nike Court Rafa tennis shoes", "Nike Dri-FIT top"]
          }
        ]
      }`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Attempt to parse the JSON response
      const parsedResponse = JSON.parse(text);
      return parsedResponse.similarOutfits || [];
    } catch (parseError) {
      console.error('Error parsing JSON response from Gemini:', parseError);
      
      // If JSON parsing fails, attempt to extract JSON portion from text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const jsonString = jsonMatch[0];
          const parsedJson = JSON.parse(jsonString);
          return parsedJson.similarOutfits || [];
        } catch (e) {
          console.error('Failed to extract JSON from text:', e);
          return [];
        }
      }
      return [];
    }
  } catch (error) {
    console.error('Image analysis error:', error);
    return [];
  }
}