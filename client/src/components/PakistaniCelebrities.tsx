import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';

type Celebrity = {
  id: number;
  name: string;
  profession: string;
  imageUrl: string;
  description: string;
  category: string;
};

export default function PakistaniCelebrities() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setCelebrities(data.pakistaniCelebrities);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading Pakistani celebrities:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center my-8">Loading Pakistani celebrities...</div>;
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Pakistani Celebrities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {celebrities.map((celebrity) => (
          <Card key={celebrity.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative aspect-[4/5] max-w-[280px] mx-auto">
              <img 
                src={celebrity.imageUrl} 
                alt={celebrity.name} 
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, replace with a fallback
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x500?text=Image+Not+Found";
                }}
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-1">{celebrity.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{celebrity.profession}</p>
              <p className="text-sm mb-3 line-clamp-2">{celebrity.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {celebrity.category}
                </span>
                <Link href={`/celebrity/${celebrity.id}`} className="text-sm font-medium text-primary hover:underline">
                  View Profile
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}