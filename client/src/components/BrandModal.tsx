import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Brand } from "@shared/schema";
import { useEffect } from "react";

interface BrandModalProps {
  brand: Brand;
  onClose: () => void;
}

export default function BrandModal({ brand, onClose }: BrandModalProps) {
  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleEscapeKey);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto"; // Restore scrolling when modal is closed
    };
  }, [onClose]);
  
  // Close modal when clicking outside the content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Mock data for celebrities wearing this brand - in a real app, you'd fetch this from the API
  const celebrityAmbassadors = ["Zendaya", "Lady Gaga", "Florence Pugh"];
  const signatureItems = ["Signature Bags", "Iconic Dresses", "Logo Collection"];
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-dark/90 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="bg-midgray rounded-lg max-w-md w-full mx-4 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <img 
              src={brand.imageUrl} 
              alt={`${brand.name} showcase`} 
              className="w-full h-48 object-cover"
            />
            <button 
              className="absolute top-4 right-4 bg-dark/50 rounded-full p-2 hover:bg-gold/80 transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X className="text-light text-lg" />
            </button>
          </div>
          
          <div className="p-6">
            <h3 className="text-2xl font-bold font-playfair text-light mb-2">{brand.name}</h3>
            <p className="text-light/70 mb-4">{brand.description}</p>
            
            <div className="mb-4">
              <h4 className="text-gold font-semibold mb-2 text-sm uppercase tracking-wider">Celebrity Ambassadors</h4>
              <div className="flex flex-wrap gap-2">
                {celebrityAmbassadors.map((celeb, index) => (
                  <span key={index} className="px-3 py-1 rounded bg-dark text-light/90 text-sm">{celeb}</span>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-gold font-semibold mb-2 text-sm uppercase tracking-wider">Signature Items</h4>
              <div className="flex flex-wrap gap-2">
                {signatureItems.map((item, index) => (
                  <span key={index} className="px-3 py-1 rounded bg-dark text-light/90 text-sm">{item}</span>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-3">
              <a
                href={`/brands/${brand.id}/products`}
                className="flex-1"
                onClick={(e) => {
                  // Allow navigation and close modal for a smooth UX
                  setTimeout(() => onClose(), 0);
                }}
              >
                <button className="w-full py-3 bg-gold text-dark font-semibold rounded text-center hover:bg-gold/90 transition-colors">
                  View Products
                </button>
              </a>
              <button 
                className="py-3 px-4 bg-dark text-light border border-white/20 rounded hover:bg-white/10 transition-colors"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
