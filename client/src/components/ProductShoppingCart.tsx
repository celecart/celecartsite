import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, X, Plus, Minus, Heart, Star, ExternalLink,
  CreditCard, Truck, Shield, ArrowRight
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: string;
  priceNumeric: number;
  imageUrl: string;
  brandName: string;
  quantity: number;
  purchaseUrl: string;
}

interface ProductShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export default function ProductShoppingCart({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem 
}: ProductShoppingCartProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.priceNumeric * item.quantity), 0);

  const handleCheckout = () => {
    // For demo purposes, open the first item's purchase URL
    if (items.length > 0) {
      window.open(items[0].purchaseUrl, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Cart Panel */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-dark to-darkgray border-l border-gold/20 shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gold/10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ShoppingBag className="w-6 h-6 text-gold" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-dark text-xs font-bold rounded-full flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-light">Shopping Cart</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="text-light/60 hover:text-light"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-16 h-16 text-light/30 mb-4" />
                    <h3 className="text-light/60 text-lg mb-2">Your cart is empty</h3>
                    <p className="text-light/40 text-sm">Start shopping by clicking product tags in videos!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map(item => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-darkgray/50 rounded-xl p-4 border border-gold/10"
                      >
                        <div className="flex gap-4">
                          <img 
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-light font-semibold text-sm line-clamp-1">
                                  {item.name}
                                </h4>
                                <p className="text-light/60 text-xs">{item.brandName}</p>
                              </div>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-light/40 hover:text-red-400 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-gold font-bold">{item.price}</span>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                  className="w-6 h-6 rounded-full bg-light/10 hover:bg-light/20 flex items-center justify-center text-light"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-light text-sm w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-full bg-gold/20 hover:bg-gold/30 flex items-center justify-center text-gold"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gold/10 p-6 space-y-4">
                  {/* Shipping Info */}
                  <div className="flex items-center gap-3 text-sm text-light/60">
                    <Truck className="w-4 h-4 text-gold" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-light/60">
                    <Shield className="w-4 h-4 text-gold" />
                    <span>Secure checkout guaranteed</span>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span className="text-light">Total:</span>
                    <span className="text-gold">${totalPrice.toLocaleString()}</span>
                  </div>

                  {/* Checkout Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-gold to-gold/90 text-dark font-bold py-4 text-lg rounded-xl hover:shadow-xl hover:shadow-gold/25"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                  
                  <p className="text-xs text-light/40 text-center">
                    You'll be redirected to the brand's official store
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}