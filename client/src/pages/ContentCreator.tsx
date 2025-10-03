import { useEffect } from "react";
import ContentWriterGuide from "@/components/ContentWriterGuide";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Info } from "lucide-react";

export default function ContentCreator() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex">
            <Button variant="outline" className="gap-2 border-gold text-light hover:bg-darkgray">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold font-playfair text-light">Content Creator Studio</h1>
          <div className="w-[120px]"></div> {/* Spacer for flex alignment */}
        </div>

        <div className="p-4 bg-midgray rounded-lg mb-6 flex gap-3 items-start border border-gold/20">
          <Info className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
          <div>
            <h2 className="font-medium text-lg text-light">Welcome to the Celebrity Research Hub</h2>
            <p className="mt-1 text-sm text-light/80">
              This tool helps you collect and organize authentic, detailed information about sports celebrities for our platform. 
              Follow the structured guide to ensure comprehensive research on fashion choices, brand partnerships, 
              personal style preferences, and more. All collected information can be exported for easy integration into our database.
            </p>
          </div>
        </div>
        
        <ContentWriterGuide />
      </div>
    </div>
  );
}