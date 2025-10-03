import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, X, Edit, Save, Trash2, Eye, EyeOff, Settings,
  Upload, Bot, User, AlertCircle, CheckCircle, Tag
} from "lucide-react";

interface VideoProduct {
  id: number;
  brandId: number;
  name: string;
  price: string;
  imageUrl: string;
  purchaseUrl: string;
  position: { x: number; y: number };
  timeStart: number;
  timeEnd: number;
  confidence?: number;
  source: 'ai' | 'manual';
  status: 'pending' | 'approved' | 'rejected';
}

interface AdminTaggingInterfaceProps {
  videoId: number;
  videoUrl: string;
  products: VideoProduct[];
  onUpdateProducts: (products: VideoProduct[]) => void;
  isAdmin?: boolean;
}

export default function AdminTaggingInterface({ 
  videoId, 
  videoUrl, 
  products, 
  onUpdateProducts,
  isAdmin = false 
}: AdminTaggingInterfaceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<VideoProduct | null>(null);
  const [newTag, setNewTag] = useState<Partial<VideoProduct> | null>(null);
  const [showAITags, setShowAITags] = useState(true);
  const [showManualTags, setShowManualTags] = useState(true);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate AI processing
  const handleAITagging = async () => {
    setIsProcessingAI(true);
    
    // Simulate AI detection delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const aiDetectedProducts: VideoProduct[] = [
      {
        id: Date.now() + 1,
        brandId: 72,
        name: "AI Detected: Designer Watch",
        price: "$2,500",
        imageUrl: "/assets/watch-detected.jpg",
        purchaseUrl: "https://example.com/watch",
        position: { x: 70, y: 25 },
        timeStart: 10,
        timeEnd: 30,
        confidence: 92,
        source: 'ai',
        status: 'pending'
      },
      {
        id: Date.now() + 2,
        brandId: 73,
        name: "AI Detected: Luxury Handbag",
        price: "$1,800",
        imageUrl: "/assets/handbag-detected.jpg",
        purchaseUrl: "https://example.com/handbag",
        position: { x: 40, y: 60 },
        timeStart: 45,
        timeEnd: 75,
        confidence: 88,
        source: 'ai',
        status: 'pending'
      }
    ];
    
    onUpdateProducts([...products, ...aiDetectedProducts]);
    setIsProcessingAI(false);
  };

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    if (!isEditing) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setNewTag({
      position: { x, y },
      timeStart: currentTime,
      timeEnd: currentTime + 10,
      source: 'manual',
      status: 'approved'
    });
  };

  const handleSaveNewTag = (tagData: Partial<VideoProduct>) => {
    if (!newTag) return;
    
    const completeTag: VideoProduct = {
      id: Date.now(),
      brandId: 1,
      name: tagData.name || 'New Product',
      price: tagData.price || '$0',
      imageUrl: tagData.imageUrl || '/assets/placeholder.jpg',
      purchaseUrl: tagData.purchaseUrl || '#',
      position: newTag.position!,
      timeStart: newTag.timeStart!,
      timeEnd: newTag.timeEnd!,
      source: 'manual',
      status: 'approved'
    };
    
    onUpdateProducts([...products, completeTag]);
    setNewTag(null);
  };

  const handleUpdateProduct = (productId: number, updates: Partial<VideoProduct>) => {
    onUpdateProducts(
      products.map(p => 
        p.id === productId ? { ...p, ...updates } : p
      )
    );
  };

  const handleDeleteProduct = (productId: number) => {
    onUpdateProducts(products.filter(p => p.id !== productId));
  };

  const visibleProducts = products.filter(product => {
    const timeVisible = currentTime >= product.timeStart && currentTime <= product.timeEnd;
    const sourceVisible = (product.source === 'ai' && showAITags) || 
                         (product.source === 'manual' && showManualTags);
    return timeVisible && sourceVisible;
  });

  const pendingAITags = products.filter(p => p.source === 'ai' && p.status === 'pending');

  if (!isAdmin) {
    return (
      <div className="text-center p-8 text-light/60">
        <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Admin access required for tagging interface</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-dark/95 to-darkgray/95 backdrop-blur-sm rounded-3xl border border-gold/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gold/10">
        <div className="flex items-center gap-3">
          <Tag className="w-6 h-6 text-gold" />
          <h3 className="text-xl font-bold text-light">Product Tagging Interface</h3>
          {pendingAITags.length > 0 && (
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              {pendingAITags.length} Pending Review
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAITagging}
            disabled={isProcessingAI}
            className="border-gold/30 text-light hover:text-gold"
          >
            <Bot className="w-4 h-4 mr-2" />
            {isProcessingAI ? 'Processing...' : 'AI Auto-Tag'}
          </Button>
          
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing 
              ? "bg-gradient-to-r from-gold to-gold/90 text-dark" 
              : "border-gold/30 text-light hover:text-gold"
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Exit Edit' : 'Edit Mode'}
          </Button>
        </div>
      </div>

      {/* Video Player with Overlay */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover cursor-crosshair"
          controls
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onClick={handleVideoClick}
        />
        
        {/* Product Tags Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {visibleProducts.map(product => (
            <motion.div
              key={product.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute pointer-events-auto"
              style={{ 
                left: `${product.position.x}%`, 
                top: `${product.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="relative group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
                  product.source === 'ai' 
                    ? product.status === 'pending'
                      ? 'bg-orange-500 border-orange-300'
                      : product.status === 'approved'
                      ? 'bg-green-500 border-green-300'
                      : 'bg-red-500 border-red-300'
                    : 'bg-gradient-to-r from-gold to-gold/90 border-white/20'
                }`}>
                  {product.source === 'ai' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-dark" />
                  )}
                </div>
                
                {/* Confidence indicator for AI tags */}
                {product.source === 'ai' && product.confidence && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs text-light/70 bg-dark/80 px-2 py-1 rounded">
                      {product.confidence}%
                    </span>
                  </div>
                )}
                
                {/* Product Info on Hover */}
                <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 bg-dark/95 backdrop-blur-sm border border-gold/30 rounded-xl p-4 min-w-64 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="flex items-start gap-3">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-light font-semibold text-sm mb-1">
                        {product.name}
                      </h4>
                      <p className="text-gold font-bold text-lg mb-2">
                        {product.price}
                      </p>
                      <div className="flex gap-2">
                        {product.source === 'ai' && product.status === 'pending' && isEditing && (
                          <>
                            <Button 
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleUpdateProduct(product.id, { status: 'approved' })}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUpdateProduct(product.id, { status: 'rejected' })}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {isEditing && (
                          <Button 
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* New Tag Preview */}
          {newTag && isEditing && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute pointer-events-none"
              style={{ 
                left: `${newTag.position!.x}%`, 
                top: `${newTag.position!.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-300 animate-pulse">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Edit Mode Indicator */}
        {isEditing && (
          <div className="absolute top-4 left-4 bg-gold/90 text-dark px-3 py-2 rounded-full text-sm font-bold">
            Edit Mode: Click to add tags
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 space-y-4">
        {/* Filter Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAITags(!showAITags)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showAITags ? 'bg-blue-500/20 text-blue-400' : 'bg-dark/50 text-light/50'
              }`}
            >
              {showAITags ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <Bot className="w-4 h-4" />
              AI Tags
            </button>
            
            <button
              onClick={() => setShowManualTags(!showManualTags)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showManualTags ? 'bg-gold/20 text-gold' : 'bg-dark/50 text-light/50'
              }`}
            >
              {showManualTags ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <User className="w-4 h-4" />
              Manual Tags
            </button>
          </div>
          
          <div className="text-light/60 text-sm">
            Current Time: {Math.floor(currentTime)}s | 
            Total Tags: {products.length} | 
            Visible: {visibleProducts.length}
          </div>
        </div>

        {/* New Tag Form */}
        <AnimatePresence>
          {newTag && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-darkgray/50 rounded-xl p-4 border border-gold/10"
            >
              <h4 className="text-light font-semibold mb-4">Add New Product Tag</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  className="bg-dark/50 border border-gold/20 text-light rounded-lg px-3 py-2"
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Price (e.g., $99)"
                  className="bg-dark/50 border border-gold/20 text-light rounded-lg px-3 py-2"
                  onChange={(e) => setNewTag({ ...newTag, price: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  className="bg-dark/50 border border-gold/20 text-light rounded-lg px-3 py-2"
                  onChange={(e) => setNewTag({ ...newTag, imageUrl: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Purchase URL"
                  className="bg-dark/50 border border-gold/20 text-light rounded-lg px-3 py-2"
                  onChange={(e) => setNewTag({ ...newTag, purchaseUrl: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setNewTag(null)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-to-r from-gold to-gold/90 text-dark"
                  onClick={() => handleSaveNewTag(newTag)}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Tag
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}