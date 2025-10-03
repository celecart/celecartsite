import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-dark">
      <Header />
      
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center px-4 py-32 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-full bg-danger/20 flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-danger" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-light font-playfair mb-4">
          Celebrity Not Found
        </h1>
        
        <p className="text-lightgray max-w-md mx-auto mb-8">
          We couldn't find the celebrity you're looking for. They might be keeping a low profile.
        </p>
        
        <Button asChild className="masterclass-button">
          <a href="/">Return to Homepage</a>
        </Button>
      </motion.div>
      
      <Footer />
    </div>
  );
}
