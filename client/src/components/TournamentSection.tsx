import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tournament } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { TournamentOutfit } from "@shared/schema";
import { Separator } from "@/components/ui/separator";

export default function TournamentSection() {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const { toast } = useToast();
  
  // Fetch tournaments
  const { data: tournaments, isLoading: tournamentsLoading } = useQuery<Tournament[]>({
    queryKey: ['/api/tournaments'],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Fetch tournament outfits for selected tournament
  const { data: tournamentOutfits, isLoading: outfitsLoading } = useQuery<(TournamentOutfit & { celebrity: any })[]>({
    queryKey: ['/api/tournamentoutfits/tournament', selectedTournament?.id],
    staleTime: 10 * 60 * 1000,
    enabled: !!selectedTournament,
  });
  
  // Surface type color map
  const surfaceColors: Record<string, string> = {
    'Clay': 'bg-orange-100 text-orange-800',
    'Grass': 'bg-green-100 text-green-800',
    'Hard': 'bg-blue-100 text-blue-800',
    'Indoor': 'bg-purple-100 text-purple-800',
    'Carpet': 'bg-red-100 text-red-800',
  };
  
  const handleTournamentClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
  };
  
  const closeOutfitsView = () => {
    setSelectedTournament(null);
  };
  
  return (
    <section className="w-full py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Grand Slam Style</h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Explore the iconic outfits worn by tennis stars at major tournaments around the world.
          </p>
        </div>
        
        {tournamentsLoading ? (
          <div className="flex justify-center">
            <p>Loading tournaments...</p>
          </div>
        ) : !selectedTournament ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tournaments && Array.isArray(tournaments) ? (
              tournaments.map((tournament) => (
                <Card 
                  key={tournament.id} 
                  className="overflow-hidden transition-all hover:shadow-lg cursor-pointer"
                  onClick={() => handleTournamentClick(tournament)}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={tournament.imageUrl} 
                      alt={tournament.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105" 
                    />
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{tournament.name}</CardTitle>
                      <Badge className={surfaceColors[tournament.surfaceType] || 'bg-gray-100'}>
                        {tournament.surfaceType}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-500">
                      {tournament.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-600">{tournament.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <p className="text-xs text-gray-500">{tournament.startDate} - {tournament.endDate}</p>
                    <Badge variant="outline">{tournament.tier}</Badge>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No tournaments found</p>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <Button variant="ghost" onClick={closeOutfitsView} className="mb-4">&larr; Back to Tournaments</Button>
                <h3 className="text-2xl font-bold">{selectedTournament.name} Outfits</h3>
                <p className="text-gray-500">{selectedTournament.location} | {selectedTournament.surfaceType} Court</p>
              </div>
              <Badge className={`${surfaceColors[selectedTournament.surfaceType] || 'bg-gray-100'} text-lg px-4 py-2`}>
                {selectedTournament.surfaceType}
              </Badge>
            </div>
            
            {outfitsLoading ? (
              <p>Loading outfits...</p>
            ) : tournamentOutfits && Array.isArray(tournamentOutfits) && tournamentOutfits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tournamentOutfits.map((outfit) => (
                  <Card key={outfit.id} className="overflow-hidden border-0 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="h-full">
                        <img 
                          src={outfit.imageUrl} 
                          alt={`${outfit.celebrity.name} outfit at ${selectedTournament.name}`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-xl">{outfit.celebrity.name}</h4>
                            <p className="text-sm text-gray-500">{outfit.year}</p>
                          </div>
                          <Badge variant={outfit.result === "Winner" ? "default" : "outline"}>
                            {outfit.result || "Competed"}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{outfit.description}</p>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-2">
                          <h5 className="font-semibold text-sm">Outfit Details</h5>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="bg-gray-50" style={{backgroundColor: outfit.outfitDetails.mainColor}}>
                              {outfit.outfitDetails.mainColor}
                            </Badge>
                            {outfit.outfitDetails.accentColor && (
                              <Badge variant="outline" className="bg-gray-50" style={{backgroundColor: outfit.outfitDetails.accentColor}}>
                                {outfit.outfitDetails.accentColor}
                              </Badge>
                            )}
                          </div>
                          {outfit.outfitDetails.specialFeatures && (
                            <p className="text-xs text-gray-500"><span className="font-medium">Features:</span> {outfit.outfitDetails.specialFeatures}</p>
                          )}
                          {outfit.outfitDetails.designInspiration && (
                            <p className="text-xs text-gray-500"><span className="font-medium">Inspiration:</span> {outfit.outfitDetails.designInspiration}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No outfit data available for this tournament.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}