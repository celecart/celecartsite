import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate subscription process
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter",
      });
    }, 1000);
  };
  
  return (
    <section className="py-16 md:py-20 bg-midgray">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold font-playfair text-light mb-4">Get Style Updates</h2>
            <p className="text-light/70">Subscribe to our newsletter for the latest celebrity fashion insights and brand spotlights. Be the first to know about new style trends.</p>
          </div>
          <div className="md:w-1/2 w-full">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 bg-dark border border-lightgray rounded focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none text-light"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  className="px-6 py-3 bg-gold text-dark font-semibold rounded hover:bg-gold/90 transition-colors whitespace-nowrap"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
            </form>
            <p className="text-light/60 text-xs mt-3">By subscribing you agree to our Privacy Policy and receive fashion updates from Style Spotlight.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
