import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tournament, TournamentOutfit } from "@shared/schema";

interface CelebrityTournamentsProps {
  celebrityId: number;
}

export default function CelebrityTournaments({ celebrityId }: CelebrityTournamentsProps) {
  // Fetch celebrity's tournament outfits
  const { data: tournamentOutfits, isLoading } = useQuery<(TournamentOutfit & { tournament: Tournament })[]>({
    queryKey: ['/api/tournamentoutfits/celebrity', celebrityId],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Group outfits by year for better organization
  const outfitsByYear = tournamentOutfits && Array.isArray(tournamentOutfits) 
    ? tournamentOutfits.reduce((acc, outfit) => {
        const year = outfit.year.toString();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(outfit);
        return acc;
      }, {} as Record<string, (TournamentOutfit & { tournament: Tournament })[]>)
    : {};
  
  // Sort years in descending order (most recent first)
  const sortedYears = Object.keys(outfitsByYear).sort((a, b) => parseInt(b) - parseInt(a));
  
  // Surface type color map
  const surfaceColors: Record<string, string> = {
    'Clay': 'bg-orange-100 text-orange-800',
    'Grass': 'bg-green-100 text-green-800',
    'Hard': 'bg-blue-100 text-blue-800',
    'Indoor': 'bg-purple-100 text-purple-800',
    'Carpet': 'bg-red-100 text-red-800',
  };
  
  // Result badge variant map
  const resultVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    'Winner': 'default',
    'Finalist': 'secondary',
    'Semi-finalist': 'outline',
    'Quarter-finalist': 'outline'
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tournament Appearances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Skeleton className="h-24 w-24 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (!tournamentOutfits || tournamentOutfits.length === 0) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Tournament Appearances</h2>
        <p className="text-gray-500">No tournament data available for this player.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 py-8">
      <h2 className="text-2xl font-bold">Tournament Appearances</h2>
      
      {sortedYears.map((year) => (
        <div key={year} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{year}</h3>
            <Separator className="flex-1" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {outfitsByYear[year].map((outfit) => (
              <Card key={outfit.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="sm:flex">
                  <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden bg-gray-100">
                    <img 
                      src={outfit.imageUrl} 
                      alt={`${outfit.tournament.name} outfit`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="sm:w-2/3 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg">{outfit.tournament.name}</h4>
                        <p className="text-sm text-gray-500">{outfit.tournament.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={surfaceColors[outfit.tournament.surfaceType] || 'bg-gray-100'}>
                          {outfit.tournament.surfaceType}
                        </Badge>
                        {outfit.result && (
                          <Badge variant={resultVariants[outfit.result] || 'outline'}>
                            {outfit.result}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{outfit.description}</p>
                    
                    <div className="text-xs text-gray-600 space-y-1">
                      {outfit.outfitDetails?.mainColor && (
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{backgroundColor: outfit.outfitDetails.mainColor}}
                          ></div>
                          <span>Main: {outfit.outfitDetails.mainColor}</span>
                          
                          {outfit.outfitDetails.accentColor && (
                            <>
                              <div 
                                className="w-3 h-3 rounded-full ml-2" 
                                style={{backgroundColor: outfit.outfitDetails.accentColor}}
                              ></div>
                              <span>Accent: {outfit.outfitDetails.accentColor}</span>
                            </>
                          )}
                        </div>
                      )}
                      
                      {outfit.outfitDetails?.specialFeatures && (
                        <p><span className="font-medium">Features:</span> {outfit.outfitDetails.specialFeatures}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}