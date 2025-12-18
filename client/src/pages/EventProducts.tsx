import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ShoppingBag } from "lucide-react";

interface CelebrityVibesEvent {
  id: number;
  name: string;
  description: string;
  eventType: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface CelebrityBrand {
  id: number;
  celebrityId: number;
  brandId: number;
  itemType: string;
  description: string;
  imageUrl?: string;
  brand?: { id: number; name: string };
}

interface EventProduct {
  id: number;
  eventId: number;
  celebrityId: number;
  productId: number;
  displayOrder: number;
  isActive: boolean;
  notes?: string;
  product?: CelebrityBrand;
}

async function fetchEvent(eventId: number): Promise<CelebrityVibesEvent> {
  const res = await fetch(`/api/celebrity-vibes-events/${eventId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
}

async function fetchEventProducts(eventId: number): Promise<EventProduct[]> {
  const res = await fetch(`/api/celebrity-vibes-events/${eventId}/products`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch event products");
  return res.json();
}

function formatDate(input?: string): string {
  if (!input) return "";
  const d = new Date(input);
  return d.toLocaleDateString();
}

export default function EventProducts() {
  const params = useParams<{ eventId: string }>();
  const eventId = Number(params?.eventId);

  const { data: event, isLoading: loadingEvent, error: eventError } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEvent(eventId),
    enabled: Number.isFinite(eventId),
  });

  const { data: products, isLoading: loadingProducts, error: productsError } = useQuery({
    queryKey: ["event-products", eventId],
    queryFn: () => fetchEventProducts(eventId),
    enabled: Number.isFinite(eventId),
  });

  useEffect(() => {
    document.title = event?.name ? `${event.name} • Event Products` : "Event Products";
  }, [event?.name]);

  return (
    <div className="min-h-screen bg-darkgray text-white">
      <Header />

      <main className="pt-28 md:pt-32 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(loadingEvent || loadingProducts) && (
          <div className="space-y-6">
            <Skeleton className="h-8 w-64 bg-midgray" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-48 rounded-2xl bg-midgray" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-48 bg-midgray" />
                <Skeleton className="h-4 w-80 bg-midgray" />
                <Skeleton className="h-4 w-72 bg-midgray" />
              </div>
            </div>
          </div>
        )}

        {!loadingEvent && (eventError || !event) && (
          <div className="text-center py-24">
            <p className="text-red-400">Failed to load event.</p>
          </div>
        )}

        {!loadingEvent && event && (
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden border border-dark">
              <div className="w-full h-40 bg-white/10 overflow-hidden">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-full object-contain object-center"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/assets/event-placeholder.svg"; }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-stone-300 to-amber-300 flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-white/50" />
                  </div>
                )}
              </div>
              <div className="p-4 bg-midgray">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">{event.name}</h1>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500/80 text-white text-xs">{event.eventType}</Badge>
                      {event.isFeatured ? (
                        <Badge className="bg-gold text-dark text-xs">Featured</Badge>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-sm text-white/70">
                    {formatDate(event.startDate)} – {formatDate(event.endDate)}
                  </div>
                </div>
                {event.description && (
                  <p className="text-white/80 text-sm mt-3">{event.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Products</h2>
              <Badge variant="outline" className="text-xs border-gold text-gold">
                {products?.length || 0} items
              </Badge>
            </div>

            {productsError && (
              <div className="text-red-400">Failed to load products.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(products || []).map((ep) => (
                <Card key={ep.id} className="bg-white border-amber-200 hover:border-amber-400 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {ep.product?.imageUrl ? (
                        <img
                          src={ep.product.imageUrl}
                          alt={ep.product.itemType || "Product Image"}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-amber-200 shadow-md"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/80"; }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-stone-200 rounded-lg flex items-center justify-center border-2 border-stone-300">
                          <ShoppingBag className="h-10 w-10 text-stone-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">{ep.product?.itemType}</h4>
                        <p className="text-sm text-gray-600">{ep.product?.brand?.name}</p>
                        {ep.product?.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ep.product.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={ep.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                            {ep.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
