import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { Celebrity } from "@shared/schema";
import { CopyCheck, Download, FileText, Info, RefreshCw, Search } from "lucide-react";

interface ContentWriterGuideProps {
  onSave?: (data: any) => void;
}

export default function ContentWriterGuide({ onSave }: ContentWriterGuideProps) {
  const [selectedCelebrity, setSelectedCelebrity] = useState<string>("");
  const [researchData, setResearchData] = useState<{[key: string]: string}>({
    biography: "",
    brands: "",
    fashion: "",
    personalStyle: "",
    achievements: "",
    tournaments: "",
    diet: "",
    lifestyle: "",
    quotes: "",
    sources: ""
  });
  const [exportFormat, setExportFormat] = useState<"json" | "markdown">("json");
  
  const { data: celebrities } = useQuery<Celebrity[]>({
    queryKey: ["/api/celebrities"],
  });

  const handleInputChange = (field: string, value: string) => {
    setResearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = () => {
    if (exportFormat === "json") {
      const jsonData = JSON.stringify(researchData, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedCelebrity || "celebrity"}_content.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const markdown = `# ${selectedCelebrity || "Celebrity"} Profile\n\n` +
        `## Biography\n${researchData.biography}\n\n` +
        `## Brand Associations\n${researchData.brands}\n\n` +
        `## Fashion Style\n${researchData.fashion}\n\n` +
        `## Personal Style Preferences\n${researchData.personalStyle}\n\n` +
        `## Notable Achievements\n${researchData.achievements}\n\n` +
        `## Tournament Appearances\n${researchData.tournaments}\n\n` +
        `## Diet & Nutrition\n${researchData.diet}\n\n` +
        `## Lifestyle\n${researchData.lifestyle}\n\n` +
        `## Notable Quotes\n${researchData.quotes}\n\n` +
        `## Research Sources\n${researchData.sources}\n`;
      
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedCelebrity || "celebrity"}_profile.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        celebrityName: selectedCelebrity,
        ...researchData
      });
    }
  };

  const handleReset = () => {
    setResearchData({
      biography: "",
      brands: "",
      fashion: "",
      personalStyle: "",
      achievements: "",
      tournaments: "",
      diet: "",
      lifestyle: "",
      quotes: "",
      sources: ""
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-darkgray">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-gold" />
            Celebrity Content Research Guide
          </CardTitle>
          <CardDescription>
            Collect comprehensive and authentic information about celebrities with this structured guide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Celebrity or Enter New Name:
            </label>
            <div className="flex gap-2">
              <select 
                className="flex h-10 w-full rounded-md border border-gold/30 bg-midgray px-3 py-2 text-sm text-light focus:outline-none focus:ring-2 focus:ring-gold"
                value={selectedCelebrity}
                onChange={(e) => setSelectedCelebrity(e.target.value)}
              >
                <option value="">-- Select or Type New --</option>
                {celebrities?.map(celeb => (
                  <option key={celeb.id} value={celeb.name}>{celeb.name}</option>
                ))}
              </select>
              <Input 
                placeholder="Or type new celebrity name" 
                value={selectedCelebrity === "" ? "" : selectedCelebrity}
                onChange={(e) => setSelectedCelebrity(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <Tabs defaultValue="guide">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="guide">Research Guide</TabsTrigger>
              <TabsTrigger value="collection">Data Collection</TabsTrigger>
              <TabsTrigger value="export">Export & Save</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guide" className="space-y-4 mt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="biography">
                  <AccordionTrigger>Biography & Background</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Collect comprehensive biographical information, including:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Full name and any known nicknames</li>
                        <li>Date and place of birth</li>
                        <li>Cultural background and nationality</li>
                        <li>Early life influences and upbringing</li>
                        <li>Career milestones and transformation</li>
                        <li>Education and formative experiences</li>
                      </ul>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Pro tip:</span> Include how their background may have influenced their style choices.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="brands">
                  <AccordionTrigger>Brand Associations & Endorsements</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Document all brand relationships, including:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Current and past brand partnerships</li>
                        <li>Signature products or collaborations</li>
                        <li>Duration of brand associations</li>
                        <li>Exclusive equipment deals</li>
                        <li>Any custom-made items from brands</li>
                        <li>Financial terms of major deals (if public)</li>
                      </ul>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Pro tip:</span> Note which brands are for sports performance vs. lifestyle/luxury.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="fashion">
                  <AccordionTrigger>Fashion Style & Evolution</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Document their fashion journey:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Signature looks and outfit elements</li>
                        <li>Evolution of style over their career</li>
                        <li>Iconic or memorable outfits</li>
                        <li>Style transitions between competitive and casual settings</li>
                        <li>Influence on sport/industry fashion trends</li>
                        <li>Any controversial fashion moments</li>
                      </ul>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Pro tip:</span> Include specific tournament/event outfits that made headlines.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="personalStyle">
                  <AccordionTrigger>Personal Style Preferences</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Gather details about personal preferences:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Preferred colors and patterns</li>
                        <li>Fabric choices and materials</li>
                        <li>Fit preferences (tight, loose, etc.)</li>
                        <li>Accessory choices (watches, jewelry, etc.)</li>
                        <li>Grooming style and hair preferences</li>
                        <li>Any superstitions related to clothing/style</li>
                      </ul>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Pro tip:</span> Note if preferences change between competition and public appearances.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="tournaments">
                  <AccordionTrigger>Tournament & Competition Style</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Document tournament-specific fashion:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Signature tournament looks by event</li>
                        <li>Special outfits for major competitions</li>
                        <li>Color schemes for different tournaments</li>
                        <li>Technical specifications of competition gear</li>
                        <li>Weather adaptations in different venues</li>
                        <li>Trophy ceremony outfits</li>
                      </ul>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Pro tip:</span> Note if they have special attire for specific tournaments.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="diet">
                  <AccordionTrigger>Diet & Nutrition Preferences</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Research their dietary habits:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Dietary restrictions or preferences</li>
                        <li>Pre-competition meal routines</li>
                        <li>Favorite foods and beverages</li>
                        <li>Nutritional supplements used</li>
                        <li>Special diets followed (keto, vegan, etc.)</li>
                        <li>Food-related brand partnerships</li>
                      </ul>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Pro tip:</span> Include any foods they've publicly mentioned avoiding or enjoying.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="lifestyle">
                  <AccordionTrigger>Lifestyle & Personal Interests</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Gather information about their lifestyle:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Hobbies and interests outside their sport</li>
                        <li>Luxury preferences (cars, homes, etc.)</li>
                        <li>Travel habits and favorite destinations</li>
                        <li>Charitable work and causes</li>
                        <li>Technology preferences</li>
                        <li>Collecting interests (art, watches, etc.)</li>
                      </ul>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Pro tip:</span> Note how their lifestyle connects to their public image and brand partnerships.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="sources">
                  <AccordionTrigger>Research Sources & Verification</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Always document and verify your sources:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Official websites and social media accounts</li>
                        <li>Verified interviews in reputable publications</li>
                        <li>Authorized biographies and documentaries</li>
                        <li>Press releases from the celebrity or their teams</li>
                        <li>Brand partnership announcements</li>
                        <li>Academic or journalistic research</li>
                      </ul>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Pro tip:</span> Always list your sources with dates and links for verification.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="p-4 bg-midgray/80 rounded-lg border border-gold/20">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Research Best Practices</h4>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Always verify information using multiple reputable sources</li>
                      <li>• Prioritize the celebrity's own statements about their preferences</li>
                      <li>• Include specific examples and instances rather than generalizations</li>
                      <li>• Note changes in preferences or style over time</li>
                      <li>• Distinguish between personal choices and sponsored content</li>
                      <li>• Record the context of each style choice (event, tournament, etc.)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="collection" className="space-y-4 mt-4">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Biography & Background:</label>
                  <Textarea 
                    placeholder="Early life, career overview, key milestones..."
                    rows={4}
                    value={researchData.biography}
                    onChange={(e) => handleInputChange("biography", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Brand Associations:</label>
                  <Textarea 
                    placeholder="Current and past brand partnerships, signature products..."
                    rows={4}
                    value={researchData.brands}
                    onChange={(e) => handleInputChange("brands", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Fashion Style & Evolution:</label>
                  <Textarea 
                    placeholder="Signature looks, style evolution, memorable outfits..."
                    rows={4}
                    value={researchData.fashion}
                    onChange={(e) => handleInputChange("fashion", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Personal Style Preferences:</label>
                  <Textarea 
                    placeholder="Preferred colors, fabrics, accessories, fit preferences..."
                    rows={4}
                    value={researchData.personalStyle}
                    onChange={(e) => handleInputChange("personalStyle", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Notable Achievements:</label>
                  <Textarea 
                    placeholder="Championships, awards, records, significant victories..."
                    rows={4}
                    value={researchData.achievements}
                    onChange={(e) => handleInputChange("achievements", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tournament Appearances & Special Outfits:</label>
                  <Textarea 
                    placeholder="Tournament-specific attire, special competition gear..."
                    rows={4}
                    value={researchData.tournaments}
                    onChange={(e) => handleInputChange("tournaments", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Diet & Nutrition:</label>
                  <Textarea 
                    placeholder="Dietary preferences, favorite foods, pre-competition meals..."
                    rows={4}
                    value={researchData.diet}
                    onChange={(e) => handleInputChange("diet", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Lifestyle & Personal Interests:</label>
                  <Textarea 
                    placeholder="Hobbies, luxury preferences, charitable causes..."
                    rows={4}
                    value={researchData.lifestyle}
                    onChange={(e) => handleInputChange("lifestyle", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Notable Quotes:</label>
                  <Textarea 
                    placeholder="Quotes about style, fashion, brand choices..."
                    rows={4}
                    value={researchData.quotes}
                    onChange={(e) => handleInputChange("quotes", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Research Sources:</label>
                  <Textarea 
                    placeholder="List all sources with dates and links..."
                    rows={4}
                    value={researchData.sources}
                    onChange={(e) => handleInputChange("sources", e.target.value)}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleReset} 
                    className="gap-1 border-gold text-gold hover:bg-gold/10"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset Form
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    className="gap-1 bg-gold text-dark hover:bg-gold/90"
                  >
                    <CopyCheck className="h-4 w-4" />
                    Save Data
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="export" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Export Collected Information</CardTitle>
                  <CardDescription>
                    Export the celebrity data in different formats for your content creation needs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Export Format:</label>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="json"
                          name="format"
                          className="h-4 w-4 border-gray-300"
                          checked={exportFormat === "json"}
                          onChange={() => setExportFormat("json")}
                        />
                        <label htmlFor="json" className="ml-2 text-sm">JSON</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="markdown"
                          name="format"
                          className="h-4 w-4 border-gray-300"
                          checked={exportFormat === "markdown"}
                          onChange={() => setExportFormat("markdown")}
                        />
                        <label htmlFor="markdown" className="ml-2 text-sm">Markdown</label>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleExport} 
                    className="w-full gap-2 bg-gold text-dark hover:bg-gold/90"
                  >
                    <Download className="h-4 w-4" />
                    Download {selectedCelebrity || "Celebrity"} Profile
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Research Tools</CardTitle>
                  <CardDescription>
                    Helpful tools and resources for gathering authentic information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-3 rounded-md border border-gold/30 hover:bg-dark/60 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Search className="h-5 w-5 text-gold mr-2" />
                          <span className="text-light">
                            Search Official {selectedCelebrity || "Celebrity"} Website
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gold text-gold hover:bg-gold/10"
                          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedCelebrity + " official website")}`, "_blank")}
                        >
                          Open
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gold/30 hover:bg-dark/60 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Search className="h-5 w-5 text-gold mr-2" />
                          <span className="text-light">
                            {selectedCelebrity || "Celebrity"} Style Articles
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gold text-gold hover:bg-gold/10"
                          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedCelebrity + " fashion style brand partnerships")}`, "_blank")}
                        >
                          Open
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gold/30 hover:bg-dark/60 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Search className="h-5 w-5 text-gold mr-2" />
                          <span className="text-light">
                            {selectedCelebrity || "Celebrity"} Brand Endorsements
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gold text-gold hover:bg-gold/10"
                          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedCelebrity + " endorsement deals sponsorships")}`, "_blank")}
                        >
                          Open
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gold/30 hover:bg-dark/60 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Search className="h-5 w-5 text-gold mr-2" />
                          <span className="text-light">
                            {selectedCelebrity || "Celebrity"} Diet & Nutrition
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gold text-gold hover:bg-gold/10"
                          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedCelebrity + " diet nutrition food preferences")}`, "_blank")}
                        >
                          Open
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}