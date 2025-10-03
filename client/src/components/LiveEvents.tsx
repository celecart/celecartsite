import React from 'react';
import { Calendar, MapPin, Star, Clock, Ticket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Celebrity } from '@shared/schema';
import { Skeleton } from "@/components/ui/skeleton";

// Define the event types we'll display
type EventType = 'fashion_show' | 'movie_premiere' | 'product_launch' | 'red_carpet' | 'award_show';

// Define our event data structure
interface LiveEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  type: EventType;
  description: string;
  imageUrl: string;
  ticketUrl?: string;
  streaming?: {
    platform: string;
    url: string;
  };
  featured?: boolean;
}

// Map event types to their display values
const eventTypeMap: Record<EventType, string> = {
  fashion_show: 'Fashion Show',
  movie_premiere: 'Movie Premiere',
  product_launch: 'Product Launch',
  red_carpet: 'Red Carpet Event',
  award_show: 'Award Show'
};

// Get event badge color based on event type
const getEventBadgeColor = (type: EventType): string => {
  switch(type) {
    case 'fashion_show':
      return 'bg-purple-100 text-purple-800';
    case 'movie_premiere':
      return 'bg-red-100 text-red-800';
    case 'product_launch':
      return 'bg-blue-100 text-blue-800';
    case 'red_carpet':
      return 'bg-pink-100 text-pink-800';
    case 'award_show':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Function to generate mock events based on celebrity
const getCelebrityEvents = (celebrity: Celebrity): LiveEvent[] => {
  // Create a base set of events based on celebrity type/profession
  const currentYear = new Date().getFullYear();
  const nextMonth = new Date().getMonth() + 1;
  
  let events: LiveEvent[] = [];
  
  // For actors
  if (celebrity.profession?.toLowerCase().includes('actor') || 
      celebrity.profession?.toLowerCase().includes('actress')) {
    
    // If it's a specific actor, we can customize their events
    if (celebrity.id === 30) { // Chris Evans
      events = [
        {
          id: 1,
          title: 'The Gray Man 2 Premiere',
          date: `${currentYear}-${nextMonth.toString().padStart(2, '0')}-15`,
          location: 'TCL Chinese Theatre, Los Angeles',
          type: 'movie_premiere',
          description: 'World premiere of the sequel to The Gray Man, featuring Chris Evans returning as the villain Lloyd Hansen.',
          imageUrl: '/assets/events/gray-man-premiere.jpg',
          featured: true
        },
        {
          id: 2,
          title: 'Captain America Legacy Panel',
          date: `${currentYear}-${nextMonth.toString().padStart(2, '0')}-22`,
          location: 'San Diego Comic-Con',
          type: 'red_carpet',
          description: 'Chris Evans joins Marvel Studios for a special panel discussing the legacy of Captain America in the MCU.',
          imageUrl: '/assets/events/captain-america-panel.jpg'
        }
      ];
    } else if (celebrity.id === 27) { // Shah Rukh Khan
      events = [
        {
          id: 3,
          title: 'King International Film Festival Opening',
          date: `${currentYear}-${nextMonth.toString().padStart(2, '0')}-10`,
          location: 'Jio World Centre, Mumbai',
          type: 'red_carpet',
          description: 'Shah Rukh Khan hosts the opening ceremony of the prestigious King International Film Festival.',
          imageUrl: '/assets/events/shah-rukh-red-carpet.jpg',
          featured: true,
          streaming: {
            platform: 'Disney+ Hotstar',
            url: 'https://www.hotstar.com/in'
          }
        },
        {
          id: 4,
          title: 'Tag Heuer Collection Launch',
          date: `${currentYear}-${nextMonth.toString().padStart(2, '0')}-18`,
          location: 'Taj Mahal Palace, Mumbai',
          type: 'product_launch',
          description: 'Shah Rukh Khan unveils the latest Tag Heuer luxury watch collection as brand ambassador.',
          imageUrl: '/assets/events/tag-heuer-launch.jpg'
        }
      ];
    } else if (celebrity.id === 33) { // Blake Lively
      events = [
        {
          id: 5,
          title: 'New York Fashion Week - Front Row',
          date: `${currentYear}-${nextMonth.toString().padStart(2, '0')}-08`,
          location: 'Spring Studios, New York',
          type: 'fashion_show',
          description: 'Blake Lively attends the Chanel Spring/Summer runway show at New York Fashion Week.',
          imageUrl: '/assets/events/blake-fashion-week.jpg',
          featured: true
        },
        {
          id: 6,
          title: 'Met Gala 2023',
          date: `${currentYear}-05-01`,
          location: 'Metropolitan Museum of Art, New York',
          type: 'red_carpet',
          description: 'Blake Lively expected to attend the prestigious Met Gala, fashion\'s biggest night.',
          imageUrl: '/assets/events/blake-met-gala.jpg'
        }
      ];
    }
  }
  
  // For athletes
  else if (celebrity.profession?.toLowerCase().includes('tennis') || 
           celebrity.profession?.toLowerCase().includes('basketball') ||
           celebrity.profession?.toLowerCase().includes('football') ||
           celebrity.profession?.toLowerCase().includes('nba')) {
    
    if (celebrity.id === 26) { // LeBron James
      events = [
        {
          id: 7,
          title: 'Nike LeBron 21 Launch Event',
          date: `${currentYear}-${nextMonth.toString().padStart(2, '0')}-12`,
          location: 'The Nike Store, Los Angeles',
          type: 'product_launch',
          description: 'LeBron James unveils his latest signature shoe, the Nike LeBron 21, with special fan meet & greet.',
          imageUrl: '/assets/events/lebron-nike-launch.jpg',
          featured: true,
          ticketUrl: 'https://www.nike.com/launch'
        },
        {
          id: 8,
          title: 'Space Jam 2 Anniversary Celebration',
          date: `${currentYear}-${nextMonth.toString().padStart(2, '0')}-20`,
          location: 'Warner Bros. Studio, Burbank',
          type: 'red_carpet',
          description: 'Special screening and cast reunion celebrating Space Jam: A New Legacy with LeBron James.',
          imageUrl: '/assets/events/lebron-space-jam.jpg'
        }
      ];
    }
  }
  
  // For musicians/entertainers
  else if (celebrity.profession?.toLowerCase().includes('singer') ||
           celebrity.profession?.toLowerCase().includes('musician')) {
    if (celebrity.id === 7) { // Adele
      events = [
        {
          id: 9,
          title: 'Adele Residency Show',
          date: `${currentYear}-${nextMonth.toString().padStart(2, '0')}-25`,
          location: 'Colosseum at Caesars Palace, Las Vegas',
          type: 'red_carpet',
          description: 'Adele performs as part of her acclaimed Las Vegas residency show series.',
          imageUrl: '/assets/events/adele-concert.jpg',
          featured: true,
          ticketUrl: 'https://www.ticketmaster.com'
        }
      ];
    }
  }
  
  // For entrepreneurs/media personalities
  else if (celebrity.profession?.toLowerCase().includes('entrepreneur') ||
           celebrity.profession?.toLowerCase().includes('personality')) {
    
    if (celebrity.name.includes('Kardashian') || celebrity.name.includes('Jenner')) {
      events.push({
        id: 10,
        title: 'The Kardashians Season 5 Premiere',
        date: `${currentYear}-${nextMonth.toString().padStart(2, '0')}-30`,
        location: 'El Capitan Theatre, Hollywood',
        type: 'red_carpet',
        description: 'Red carpet premiere for the latest season of The Kardashians on Hulu.',
        imageUrl: '/assets/events/kardashian-premiere.jpg',
        streaming: {
          platform: 'Hulu',
          url: 'https://www.hulu.com'
        }
      });
    }
  }
  
  // If we have no specific events, generate a generic one
  if (events.length === 0) {
    events.push({
      id: 100,
      title: `${celebrity.name} Fan Meeting`,
      date: `${currentYear}-${nextMonth.toString().padStart(2, '0')}-20`,
      location: 'Virtual Event',
      type: 'red_carpet',
      description: `${celebrity.name} hosts an exclusive virtual fan meeting and Q&A session.`,
      imageUrl: '/assets/events/virtual-event.jpg',
      streaming: {
        platform: 'YouTube Live',
        url: 'https://www.youtube.com'
      }
    });
  }
  
  return events;
};

interface LiveEventsProps {
  celebrity: Celebrity;
  loading?: boolean;
}

const LiveEvents: React.FC<LiveEventsProps> = ({ celebrity, loading = false }) => {
  const events = getCelebrityEvents(celebrity);
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((item) => (
            <Card key={item} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  // Featured event (if any)
  const featuredEvent = events.find(event => event.featured);
  
  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-8 border border-amber-200 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-playfair font-bold mb-3 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent">
              Upcoming Events
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Follow <span className="font-semibold text-amber-700">{celebrity.name}</span>'s latest fashion shows, premieres, and public appearances.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">🎬 Premieres</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">👗 Fashion Shows</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">🏆 Award Shows</span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">📺 Live Streams</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Event */}
      {featuredEvent && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Star className="w-6 h-6 text-yellow-300" />
              </div>
              <h4 className="text-2xl font-playfair font-bold">Featured Event</h4>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <div className="aspect-video rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                  {featuredEvent.imageUrl ? (
                    <div 
                      className="absolute inset-0 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${featuredEvent.imageUrl})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-red-500 text-white border-0 px-3 py-1 text-sm font-semibold">
                          Red Carpet Event
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                          🔴 LIVE
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Calendar className="w-16 h-16 text-white/60" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h5 className="text-2xl font-playfair font-bold mb-3">{featuredEvent.title}</h5>
                  <div className="space-y-2 text-white/90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>July 19, 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Virtual Event</span>
                    </div>
                  </div>
                  <p className="text-white/80 mt-4 leading-relaxed">
                    {celebrity.name} hosts an exclusive virtual fan meeting and Q&A session.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-6">
                    <Clock className="w-4 h-4 mr-2" />
                    Streaming on YouTube Live
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Ticket className="w-4 h-4 mr-2" />
                    Free Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Event Grid */}
      <div className="space-y-6">
        <h4 className="text-2xl font-playfair font-bold text-amber-700">All Events</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.filter(event => !event.featured).map((event) => (
            <div key={event.id} className="group">
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02]">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {event.imageUrl ? (
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" 
                      style={{ backgroundImage: `url(${event.imageUrl})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-gray-800 border-0 font-semibold">
                          {eventTypeMap[event.type]}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <div className="bg-amber-500 text-white rounded-full p-2 shadow-lg">
                          <Calendar className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-100 to-orange-100">
                      <Calendar className="w-12 h-12 text-amber-400" />
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-playfair line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {event.title}
                  </CardTitle>
                  <div className="space-y-1">
                    <CardDescription className="flex items-center gap-2 text-amber-600">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </CardDescription>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow pb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>
                </CardContent>
                
                <CardFooter className="pt-0 gap-2">
                  {event.ticketUrl && (
                    <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 flex-1">
                      <Ticket className="w-4 h-4 mr-2" />
                      Get Tickets
                    </Button>
                  )}
                  
                  {event.streaming && (
                    <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50 flex-1">
                      <Clock className="w-4 h-4 mr-2" />
                      Watch Live
                    </Button>
                  )}
                  
                  {!event.ticketUrl && !event.streaming && (
                    <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50 w-full">
                      <Star className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {events.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
          <div className="p-4 bg-amber-100 rounded-full w-fit mx-auto mb-6">
            <Calendar className="w-12 h-12 text-amber-600" />
          </div>
          <h4 className="text-xl font-playfair font-bold text-amber-700 mb-2">No upcoming events</h4>
          <p className="text-sm text-gray-500">Check back later for {celebrity.name}'s upcoming appearances</p>
        </div>
      )}
    </div>
  );
};

export default LiveEvents;