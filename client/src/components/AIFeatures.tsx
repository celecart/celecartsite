import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Celebrity } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Send, Sparkles, Shirt, Camera, MessageSquare, Upload, ShoppingBag, Wand2, Tag } from 'lucide-react';

interface StyleAnalysisProps {
  celebrity: Celebrity;
  className?: string;
}

export function StyleAnalysis({ celebrity, className }: StyleAnalysisProps) {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['/api/ai/style-analysis', celebrity.id],
    queryFn: async () => {
      const data = await apiRequest<{ analysis: string }>(`/api/ai/style-analysis/${celebrity.id}`);
      return data.analysis;
    },
    enabled: !!celebrity.id,
  });

  return (
    <div className={`bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl border border-amber-200 overflow-hidden ${className}`}>
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-playfair font-bold text-white">AI Style Analysis</h3>
            <p className="text-white/90 text-sm">Advanced fashion intelligence powered by Claude AI</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
              <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-amber-200 opacity-20"></div>
            </div>
            <p className="text-amber-600 mt-4 font-medium">Analyzing {celebrity.name}'s signature style...</p>
            <p className="text-gray-500 text-sm mt-1">Processing fashion data with AI intelligence</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Style Summary Card */}
            <div className="bg-white rounded-xl p-6 border border-amber-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <Wand2 className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-3">Style DNA Analysis</h4>
                  <div className="prose prose-amber max-w-none">
                    <p className="text-gray-700 leading-relaxed">{analysis}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Style Elements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-amber-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shirt className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Signature Pieces</p>
                    <p className="text-sm text-gray-600">Core wardrobe essentials</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-amber-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Tag className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Brand Preferences</p>
                    <p className="text-sm text-gray-600">Luxury partnerships</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-amber-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingBag className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Style Evolution</p>
                    <p className="text-sm text-gray-600">Fashion journey insights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center pt-4">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Detailed Style Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface OutfitRecommendationsProps {
  celebrity: Celebrity;
  className?: string;
}

export function OutfitRecommendations({ celebrity, className }: OutfitRecommendationsProps) {
  const [userPreferences, setUserPreferences] = useState('');
  const [occasion, setOccasion] = useState('');
  const [weather, setWeather] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [eventFormality, setEventFormality] = useState('casual');
  const [ageGroup, setAgeGroup] = useState('');
  const [budget, setBudget] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPreferences || !occasion) return;

    setIsLoading(true);
    try {
      const response = await apiRequest<{recommendations: string[]}>('/api/ai/outfit-recommendations', {
        method: 'POST',
        body: JSON.stringify({
          userPreferences,
          celebrityName: celebrity.name,
          occasion,
          weather,
          bodyType,
          eventFormality,
          ageGroup,
          budget,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setRecommendations(response.recommendations);
    } catch (error) {
      console.error('Failed to get outfit recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl border border-blue-200 overflow-hidden ${className}`}>
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <Shirt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-playfair font-bold text-white">AI Style Recommendations</h3>
            <p className="text-white/90 text-sm">Personalized outfits inspired by {celebrity.name}'s fashion sense</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Style Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setOccasion('Business Meeting')}
              className={`p-4 rounded-xl border-2 transition-all ${
                occasion === 'Business Meeting'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                  💼
                </div>
                <p className="text-sm font-medium">Business</p>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setOccasion('Casual Day Out')}
              className={`p-4 rounded-xl border-2 transition-all ${
                occasion === 'Casual Day Out'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                  ☀️
                </div>
                <p className="text-sm font-medium">Casual</p>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setOccasion('Formal Event')}
              className={`p-4 rounded-xl border-2 transition-all ${
                occasion === 'Formal Event'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                  🎭
                </div>
                <p className="text-sm font-medium">Formal</p>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setOccasion('Date Night')}
              className={`p-4 rounded-xl border-2 transition-all ${
                occasion === 'Date Night'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-pink-100 rounded-full flex items-center justify-center">
                  💕
                </div>
                <p className="text-sm font-medium">Date</p>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Custom Occasion</label>
              <Input
                placeholder="Describe your specific event or occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="border-gray-300 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Budget Range</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select budget</option>
                <option value="under-100">Under $100</option>
                <option value="100-500">$100 - $500</option>
                <option value="500-1000">$500 - $1,000</option>
                <option value="luxury">Luxury ($1,000+)</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Your Style Preferences</label>
            <Textarea
              placeholder="Tell us about your style preferences, favorite colors, body type, or specific pieces you love..."
              value={userPreferences}
              onChange={(e) => setUserPreferences(e.target.value)}
              required
              rows={3}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
          </Button>
          
          {showAdvanced && (
            <div className="space-y-4 bg-muted/30 p-3 rounded-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Weather/Season</label>
                <Input
                  placeholder="e.g., Rainy, Hot summer day, Winter formal"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Body Type/Features</label>
                <Input
                  placeholder="e.g., Athletic build, Tall, Petite, Plus-size"
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Formality</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  value={eventFormality}
                  onChange={(e) => setEventFormality(e.target.value)}
                >
                  <option value="ultra-casual">Ultra-Casual (e.g., Beach day)</option>
                  <option value="casual">Casual (e.g., Coffee date)</option>
                  <option value="smart-casual">Smart Casual (e.g., Office gathering)</option>
                  <option value="business">Business (e.g., Interview)</option>
                  <option value="formal">Formal (e.g., Wedding guest)</option>
                  <option value="black-tie">Black Tie (e.g., Gala event)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Age Group</label>
                <Input
                  placeholder="e.g., 20s, 30-40, Teen"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget Range</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="">Select budget range</option>
                  <option value="budget">Budget-friendly</option>
                  <option value="mid-range">Mid-range</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
          )}
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Your Stylist Recommendations...
              </>
            ) : (
              <>
                Get {celebrity.name}-Inspired Style
              </>
            )}
          </Button>
        </form>

        {recommendations.length > 0 && (
          <div className="mt-8 space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">✨ Your Personalized Style Recommendations</h4>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <p className="text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface FashionChatbotProps {
  className?: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function FashionChatbot({ className }: FashionChatbotProps) {
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Lumous AI Fashion Stylist. I can advise you on celebrity-inspired outfits for any occasion, weather condition, or body type. How can I help you today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const suggestionQuestions = [
    "What should I wear to a summer wedding like Blake Lively would?",
    "How can I dress for rainy weather in a business setting?",
    "What outfit would Angelina Jolie wear to a casual dinner?",
    "What styles work best for athletic body types?",
    "How to dress like Chris Evans for a first date?",
    "What accessories would complete my winter formal look?"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue
    };

    setConversation(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await apiRequest<{response: string}>('/api/ai/chatbot', {
        method: 'POST',
        body: JSON.stringify({
          question: userMessage.content,
          conversationHistory: conversation
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response
      };

      setConversation(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.'
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={`bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl border border-purple-200 overflow-hidden ${className}`}>
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-playfair font-bold text-white">AI Fashion Stylist</h3>
            <p className="text-white/90 text-sm">Your personal fashion consultant powered by advanced AI</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="p-6">
        <div className="bg-white rounded-xl border border-purple-100 shadow-sm h-[500px] flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.map((message, i) => (
              <div
                key={i}
                className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {showSuggestions && conversation.length === 1 && (
            <div className="flex justify-center my-4">
              <div className="grid grid-cols-1 gap-2 w-full">
                <p className="text-xs text-center text-muted-foreground mb-1">Try asking about:</p>
                {suggestionQuestions.map((suggestion, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="text-xs py-1 px-2 h-auto text-left justify-start"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg px-4 py-2 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            placeholder="Ask about weather, event, body type, or celebrity styles..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        {!showSuggestions && conversation.length > 2 && (
          <div className="mt-2 text-center">
            <Button 
              variant="link" 
              className="text-xs text-muted-foreground"
              onClick={() => setShowSuggestions(true)}
            >
              Show more suggestions
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

interface ImageAnalysisProps {
  className?: string;
}

export function ImageAnalysis({ className }: ImageAnalysisProps) {
  const [imageDescription, setImageDescription] = useState('');
  const [occasionContext, setOccasionContext] = useState('');
  const [weatherSeason, setWeatherSeason] = useState('');
  const [similarOutfits, setSimilarOutfits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageDescription.trim()) return;

    setIsLoading(true);
    try {
      const response = await apiRequest<{similarOutfits: any[]}>('/api/ai/image-analysis', {
        method: 'POST',
        body: JSON.stringify({ 
          imageDescription,
          occasionContext,
          weatherSeason 
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setSimilarOutfits(response.similarOutfits || []);
    } catch (error) {
      console.error('Image analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Celebrity Style Matcher
        </CardTitle>
        <CardDescription>
          Describe an outfit and find matching celebrity styles with similar pieces
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Outfit Description</label>
            <Textarea
              placeholder="Describe the outfit in detail (e.g., black leather jacket with white t-shirt, slim jeans and boots)"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              required
              rows={3}
            />
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide Context Options" : "Add Occasion & Weather Context"}
          </Button>
          
          {showAdvanced && (
            <div className="space-y-4 bg-muted/30 p-3 rounded-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Occasion/Event</label>
                <Input
                  placeholder="e.g., Red carpet event, Beach vacation, Office meeting"
                  value={occasionContext}
                  onChange={(e) => setOccasionContext(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Weather/Season</label>
                <Input
                  placeholder="e.g., Summer heat, Winter formal, Fall outdoor event"
                  value={weatherSeason}
                  onChange={(e) => setWeatherSeason(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Celebrity Matches...
              </>
            ) : (
              <>
                Find Celebrity Style Matches
              </>
            )}
          </Button>
        </form>

        {similarOutfits.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-medium">Matching celebrity styles:</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {similarOutfits.map((outfit, i) => (
                <div key={i} className="rounded-md border p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-primary">{outfit.celebrityName}</h5>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {Math.round(outfit.confidence * 100)}% match
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <h6 className="text-xs font-medium uppercase text-muted-foreground">Matching Elements</h6>
                      <ul className="mt-1 text-sm">
                        {outfit.matchingElements.map((element: string, j: number) => (
                          <li key={j} className="list-disc ml-4 text-xs">{element}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h6 className="text-xs font-medium uppercase text-muted-foreground">Where To Buy</h6>
                      <ul className="mt-1 text-sm">
                        {outfit.recommendedItems.map((item: string, j: number) => (
                          <li key={j} className="list-disc ml-4 text-xs">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {outfit.occasionSuggestion && (
                    <div className="mt-3 pt-2 border-t">
                      <h6 className="text-xs font-medium">Perfect for:</h6>
                      <p className="text-xs italic">{outfit.occasionSuggestion}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface FashionRecognizerProps {
  className?: string;
}

export function FashionRecognizer({ className }: FashionRecognizerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognitionResults, setRecognitionResults] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = (file: File) => {
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    // Check if file is too large (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please upload an image smaller than 5MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleFileBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  const handleAnalyzeImage = async () => {
    if (!selectedFile || !previewUrl) return;
    
    setIsAnalyzing(true);
    
    try {
      // Convert image to base64 for API request
      const base64Image = previewUrl.split(',')[1];
      
      // Mock response - in a real app this would call the server API
      const mockResponse = {
        items: [
          {
            type: "Top",
            name: "White Cotton T-Shirt",
            brand: "Gucci",
            confidence: 0.92,
            similarToCelebrity: "Angelina Jolie",
            price: "$550",
            whereToBuy: "gucci.com"
          },
          {
            type: "Bottom",
            name: "Black Skinny Jeans",
            brand: "Frame",
            confidence: 0.89,
            similarToCelebrity: "Kendall Jenner",
            price: "$210",
            whereToBuy: "nordstrom.com/frame"
          },
          {
            type: "Footwear",
            name: "Leather Ankle Boots",
            brand: "Stuart Weitzman",
            confidence: 0.94,
            similarToCelebrity: "Blake Lively",
            price: "$595",
            whereToBuy: "stuartweitzman.com"
          }
        ],
        makeup: [
          {
            type: "Foundation",
            brand: "Armani Beauty",
            product: "Luminous Silk Foundation",
            shade: "4.5 Medium",
            price: "$69",
            whereToBuy: "sephora.com"
          },
          {
            type: "Lipstick",
            brand: "Charlotte Tilbury",
            product: "Matte Revolution",
            shade: "Pillow Talk",
            price: "$34",
            whereToBuy: "charlottetilbury.com"
          }
        ],
        accessories: [
          {
            type: "Bag",
            name: "Leather Tote",
            brand: "Louis Vuitton",
            confidence: 0.88,
            price: "$2,450",
            whereToBuy: "louisvuitton.com"
          },
          {
            type: "Sunglasses",
            name: "Aviator Classic",
            brand: "Ray-Ban",
            confidence: 0.91,
            price: "$161",
            whereToBuy: "ray-ban.com"
          }
        ],
        overallStyle: "Modern Classic with Luxury Essentials",
        similarToCelebrities: [
          "Angelina Jolie - 87% match",
          "Blake Lively - 76% match",
          "Kendall Jenner - 73% match"
        ],
        stylistNotes: "This is a versatile luxury casual outfit that balances comfort with high-end elements. The minimalist palette allows for the quality of each piece to stand out, while the accessories add polish and sophistication."
      };
      
      // Simulate API delay
      setTimeout(() => {
        setRecognitionResults(mockResponse);
        setIsAnalyzing(false);
      }, 2000);
      
      // In a real implementation, you would call the server API
      // const response = await apiRequest('/api/ai/fashion-recognizer', {
      //   method: 'POST',
      //   body: JSON.stringify({ image: base64Image }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // setRecognitionResults(response);
      
    } catch (error) {
      console.error('Failed to analyze image:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRecognitionResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Fashion AI Identifier
        </CardTitle>
        <CardDescription>
          Upload an image to identify clothing items, brands, makeup, and accessories
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!recognitionResults ? (
          <>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors mb-4 ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`}
              onDrop={handleFileDrop}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
            >
              {previewUrl ? (
                <div className="space-y-4">
                  <div className="max-h-[300px] overflow-hidden rounded-md mx-auto">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="mx-auto max-h-[300px] object-contain" 
                    />
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={resetAnalysis} size="sm">
                      Change Image
                    </Button>
                    <Button onClick={handleAnalyzeImage} disabled={isAnalyzing} size="sm">
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : "Identify Items & Brands"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-base font-semibold">Drag & drop image or click to browse</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Upload a fashion photo to identify specific clothing items, brands, and makeup products
                  </p>
                  <Button variant="outline" onClick={handleFileBrowse}>
                    Browse Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <div className="text-xs text-center text-muted-foreground">
              Supported formats: JPG, PNG, WEBP • Max size: 5MB
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <div className="rounded-md overflow-hidden">
                  <img 
                    src={previewUrl!} 
                    alt="Analyzed" 
                    className="w-full object-cover" 
                  />
                </div>
                <div className="mt-3">
                  <h4 className="text-sm font-medium">Overall Style:</h4>
                  <p className="text-sm">{recognitionResults.overallStyle}</p>
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Similar Celebrity Styles:</h4>
                  <ul className="text-sm">
                    {recognitionResults.similarToCelebrities.map((celeb: string, i: number) => (
                      <li key={i} className="text-xs">{celeb}</li>
                    ))}
                  </ul>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full"
                  onClick={resetAnalysis}
                >
                  Analyze Another Image
                </Button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-base font-medium flex items-center gap-2 mb-3">
                    <Shirt className="h-4 w-4" /> Clothing Items
                  </h3>
                  <div className="space-y-3">
                    {recognitionResults.items.map((item: any, i: number) => (
                      <div key={i} className="border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {Math.round(item.confidence * 100)}% match
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Brand:</span>
                            <span className="text-xs">{item.brand}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Price:</span>
                            <span className="text-xs">{item.price}</span>
                          </div>
                          <div className="col-span-2 mt-1">
                            <span className="text-xs text-muted-foreground">Where to buy: </span>
                            <a href="#" className="text-xs text-primary hover:underline">
                              {item.whereToBuy}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium flex items-center gap-2 mb-3">
                    <span>💄</span> Makeup Products
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {recognitionResults.makeup.map((item: any, i: number) => (
                      <div key={i} className="border rounded-md p-3">
                        <div className="font-medium text-sm">{item.product}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {item.brand} • {item.shade}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs">{item.price}</span>
                          <a href="#" className="text-xs text-primary hover:underline">
                            Where to buy
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium flex items-center gap-2 mb-3">
                    <span>👜</span> Accessories
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {recognitionResults.accessories.map((item: any, i: number) => (
                      <div key={i} className="border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{item.name}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {Math.round(item.confidence * 100)}%
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {item.brand} • {item.price}
                        </div>
                        <div className="mt-2 text-right">
                          <a href="#" className="text-xs text-primary hover:underline">
                            Where to buy
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium mb-1">Stylist Notes:</h4>
                  <p className="text-sm text-muted-foreground">
                    {recognitionResults.stylistNotes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AIFeaturesTabs({ celebrity }: { celebrity: Celebrity }) {
  return (
    <div className="w-full">
      <Tabs defaultValue="style" className="w-full">
        {/* Enhanced Tab Navigation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100 via-orange-100 to-red-100 rounded-2xl opacity-50"></div>
          <TabsList className="relative bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-2 grid grid-cols-5 gap-1 shadow-lg">
            <TabsTrigger 
              value="style" 
              className="relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-amber-50"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Style Analysis</span>
              <span className="sm:hidden">Analysis</span>
            </TabsTrigger>
            <TabsTrigger 
              value="outfits" 
              className="relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-blue-50"
            >
              <Shirt className="w-4 h-4" />
              <span className="hidden sm:inline">Outfit Recs</span>
              <span className="sm:hidden">Outfits</span>
            </TabsTrigger>
            <TabsTrigger 
              value="chatbot" 
              className="relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-purple-50"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">AI Stylist</span>
              <span className="sm:hidden">Chat</span>
            </TabsTrigger>
            <TabsTrigger 
              value="image" 
              className="relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-green-50"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Style Matcher</span>
              <span className="sm:hidden">Match</span>
            </TabsTrigger>
            <TabsTrigger 
              value="recognition" 
              className="relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-rose-50"
            >
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">Identify Items</span>
              <span className="sm:hidden">Identify</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content with Enhanced Styling */}
        <div className="relative">
          <TabsContent value="style" className="mt-0 focus-visible:outline-none">
            <StyleAnalysis celebrity={celebrity} />
          </TabsContent>
          <TabsContent value="outfits" className="mt-0 focus-visible:outline-none">
            <OutfitRecommendations celebrity={celebrity} />
          </TabsContent>
          <TabsContent value="chatbot" className="mt-0 focus-visible:outline-none">
            <FashionChatbot />
          </TabsContent>
          <TabsContent value="image" className="mt-0 focus-visible:outline-none">
            <ImageAnalysis />
          </TabsContent>
          <TabsContent value="recognition" className="mt-0 focus-visible:outline-none">
            <FashionRecognizer />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}