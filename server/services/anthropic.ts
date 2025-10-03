import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeImageForFashion(imageBase64: string) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      system: `You are a fashion expert AI with extensive knowledge of clothing brands, styles, fashion trends, makeup products, and accessories. 
      Analyze the provided image and identify the following:
      1. Clothing items (with specific details on brand, style, materials if recognizable)
      2. Makeup products (with brand and shade suggestions if visible)
      3. Accessories (with brand identification if possible)
      4. Overall style classification
      5. Celebrity style matches (which celebrities have similar style)
      
      Format your response as a JSON object with the following structure:
      {
        "items": [
          {
            "type": "Top/Bottom/Outerwear/Footwear",
            "name": "Item name",
            "brand": "Brand name",
            "confidence": 0.XX (your confidence level from 0-1),
            "similarToCelebrity": "Celebrity name",
            "price": "Estimated price range",
            "whereToBuy": "Store or website"
          }
        ],
        "makeup": [
          {
            "type": "Foundation/Lipstick/etc",
            "brand": "Brand name",
            "product": "Product name",
            "shade": "Color/shade",
            "price": "Estimated price",
            "whereToBuy": "Store or website"
          }
        ],
        "accessories": [
          {
            "type": "Bag/Jewelry/Sunglasses/etc",
            "name": "Item name",
            "brand": "Brand name",
            "confidence": 0.XX,
            "price": "Estimated price",
            "whereToBuy": "Store or website"
          }
        ],
        "overallStyle": "Style description",
        "similarToCelebrities": [
          "Celebrity name - XX% match",
          "Celebrity name - XX% match",
          "Celebrity name - XX% match"
        ],
        "stylistNotes": "Professional fashion stylist notes about the outfit"
      }`,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this fashion image and identify all clothing items, brands, makeup products, and accessories. Provide detailed fashion analysis.'
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64
              }
            }
          ]
        }
      ]
    });

    // Try to parse the JSON response
    try {
      if (response.content && response.content.length > 0 && 'text' in response.content[0]) {
        const contentText = response.content[0].text;
        const jsonMatch = contentText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
      console.error('Failed to extract JSON from Claude response');
      return null;
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error analyzing image with Claude:', error);
    throw error;
  }
}

export async function generatePersonalizedOutfitSuggestions(
  celebrityName: string,
  userPreferences: string,
  occasion: string,
  weather?: string, 
  bodyType?: string,
  eventFormality?: string,
  ageGroup?: string,
  budget?: string
) {
  try {
    let prompt = `Generate personalized outfit recommendations inspired by ${celebrityName}'s style for a user who is attending a ${occasion}.`;
    
    if (userPreferences) {
      prompt += ` The user has the following style preferences: "${userPreferences}".`;
    }
    
    if (weather) {
      prompt += ` Weather conditions: ${weather}.`;
    }
    
    if (bodyType) {
      prompt += ` Body type/features: ${bodyType}.`;
    }
    
    if (eventFormality) {
      prompt += ` Event formality: ${eventFormality}.`;
    }
    
    if (ageGroup) {
      prompt += ` Age group: ${ageGroup}.`;
    }
    
    if (budget) {
      prompt += ` Budget: ${budget}.`;
    }
    
    prompt += `\n\nProvide 3-5 detailed outfit recommendations with:
    1. Specific clothing items with brand suggestions
    2. Accessories that complement the look
    3. Hair and makeup suggestions (if applicable)
    4. Specific reasons why these recommendations match ${celebrityName}'s style
    5. Where to purchase these items (specify stores or websites)
    
    Format your response as a JSON array where each element represents a complete outfit recommendation.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    // Try to parse the JSON response
    try {
      if (response.content && response.content.length > 0 && 'text' in response.content[0]) {
        const contentText = response.content[0].text;
        const jsonMatch = contentText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
      console.error('Failed to extract JSON from Claude response');
      return null;
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
      // Fallback: Return the text response split into paragraphs
      if (response.content && response.content.length > 0 && 'text' in response.content[0]) {
        const contentText = response.content[0].text;
        return contentText.split('\n\n').filter((p: string) => p.trim().length > 0);
      }
      return [];
    }
  } catch (error) {
    console.error('Error generating outfit recommendations with Claude:', error);
    throw error;
  }
}

export async function getCelebrityStyleAnalysis(celebrityProfile: any): Promise<string> {
  try {
    const prompt = `Perform a comprehensive style analysis for ${celebrityProfile.name}, who is a ${celebrityProfile.profession}.
    
    Consider the following details about their style:
    - Signature style: ${celebrityProfile.stylingDetails?.signatureStyle || 'Unknown'}
    - Color palette: ${celebrityProfile.stylingDetails?.colorPalette || 'Unknown'}
    - Favorite brands: ${celebrityProfile.stylingDetails?.favoriteDesigners?.join(', ') || 'Unknown'}
    - Stylist (if known): ${celebrityProfile.stylingDetails?.stylist || 'Unknown'}
    - Style evolution: ${celebrityProfile.stylingDetails?.styleEvolution || 'Unknown'}
    - Iconic outfits: ${celebrityProfile.stylingDetails?.iconicOutfits?.join(', ') || 'Unknown'}
    
    Provide a detailed, insightful analysis of their fashion sense, including:
    1. Defining elements of their personal style
    2. How their style has evolved over time
    3. Their influence on fashion trends
    4. What makes their style unique and recognizable
    5. How their personal brand aligns with their fashion choices
    
    Format the analysis as a cohesive, detailed review that would be valuable to fashion enthusiasts.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    if (response.content && response.content.length > 0 && 'text' in response.content[0]) {
      return response.content[0].text;
    }
    return "Could not generate style analysis.";
  } catch (error) {
    console.error('Error analyzing celebrity style with Claude:', error);
    throw error;
  }
}

export async function getAIFashionChatResponse(question: string, conversationHistory: any[]): Promise<string> {
  try {
    // Format the conversation history for Claude
    const formattedMessages = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));
    
    // Add the current question
    formattedMessages.push({
      role: 'user' as const,
      content: question
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1000,
      system: `You are a knowledgeable fashion assistant specializing in celebrity style, fashion brands, styling advice, and trend analysis.
      
      Your expertise includes:
      1. In-depth knowledge of celebrity fashion preferences and brand partnerships
      2. Current fashion trends across various categories (clothing, accessories, footwear)
      3. Personalized styling advice based on body type, occasion, weather, and personal preferences
      4. Makeup and beauty recommendations that complement outfits
      5. Ethical fashion practices and sustainability
      
      When giving advice:
      - Be specific about brands, items, and styling techniques
      - Consider practical factors like weather, body type, and occasion
      - Provide styling tips that are actually helpful and implementable
      - Refer to celebrity styling techniques when relevant
      - Suggest where to purchase recommended items
      
      Keep responses friendly, conversational, and tailored to the user's specific situation.`,
      messages: formattedMessages
    });

    if (response.content && response.content.length > 0 && 'text' in response.content[0]) {
      return response.content[0].text;
    }
    return "I'm sorry, I couldn't process your fashion question. Please try again.";
  } catch (error) {
    console.error('Error getting fashion chat response from Claude:', error);
    throw error;
  }
}

export async function findMatchingCelebrityStyles(
  outfitDescription: string, 
  occasionContext?: string, 
  weatherSeason?: string
): Promise<any[]> {
  try {
    let prompt = `Find celebrity styles that match this outfit description: "${outfitDescription}"`;
    
    if (occasionContext) {
      prompt += `. The occasion/context is: ${occasionContext}`;
    }
    
    if (weatherSeason) {
      prompt += `. The weather/season is: ${weatherSeason}`;
    }
    
    prompt += `\n\nIdentify 3-5 celebrities whose style matches this description, including:
    1. Celebrity name
    2. Confidence level of the match (as a decimal between 0-1)
    3. Specific matching elements between the description and the celebrity's style
    4. Recommended items to complete the look
    5. Occasions this style would be perfect for
    
    Format your response as a JSON array of objects with the following structure:
    [
      {
        "celebrityName": "Celebrity Name",
        "confidence": 0.XX,
        "matchingElements": ["Element 1", "Element 2", "Element 3"],
        "recommendedItems": ["Item 1", "Item 2", "Item 3"],
        "occasionSuggestion": "Perfect for..."
      }
    ]`;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    // Try to parse the JSON response
    try {
      if (response.content && response.content.length > 0 && 'text' in response.content[0]) {
        const contentText = response.content[0].text;
        const jsonMatch = contentText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
      console.error('Failed to extract JSON from Claude response');
      return [];
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error finding matching celebrity styles with Claude:', error);
    throw error;
  }
}