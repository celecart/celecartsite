import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FaTwitter, FaFacebook, FaInstagram, FaLink } from 'react-icons/fa';
import { Check, Copy, Share2 } from 'lucide-react';

// Props interface
interface OutfitShareCardProps {
  imageUrl: string;
  title: string;
  description?: string;
  productUrl?: string;
  price?: string;
  celebrityName: string;
  brandName?: string;
  productName?: string;
  occasion?: string;
}

export function OutfitShareCard({
  imageUrl,
  title,
  description,
  productUrl,
  price,
  celebrityName,
  brandName,
  productName,
  occasion
}: OutfitShareCardProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate hashtags based on celebrity, brand, product
  const generateHashtags = () => {
    const tags = [
      celebrityName.replace(/\s+/g, ''),
      'Fashion',
      'StyleInspiration',
      'CelebrityStyle'
    ];
    
    if (brandName) {
      tags.push(brandName.replace(/\s+/g, ''));
    }
    
    if (productName) {
      tags.push(productName.replace(/\s+/g, ''));
    }
    
    if (occasion) {
      tags.push(occasion.replace(/\s+/g, ''));
    }
    
    return tags.map(tag => `#${tag}`).join(' ');
  };
  
  // Share text
  const shareText = `Check out ${celebrityName}'s ${title}${price ? ` (${price})` : ''}. ${generateHashtags()}`;
  
  // Social media share handlers
  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl || window.location.href)}`;
    window.open(url, '_blank');
  };
  
  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl || window.location.href)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };
  
  const handleInstagramShare = () => {
    // Instagram doesn't have a direct web sharing API
    // Instead, we can copy the text with hashtags to clipboard
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    alert('Caption copied to clipboard! Open Instagram to post with this image.');
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${productUrl || window.location.href}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-neutral-100 hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square bg-neutral-50 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/400x400/f3f4f6/a3a3a3?text=Image+Unavailable';
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        
        {brandName && (
          <p className="text-sm text-gray-500 mb-1">by {brandName}</p>
        )}
        
        {price && (
          <p className="text-gold font-medium mb-2">{price}</p>
        )}
        
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{description}</p>
        )}
        
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 border-blue-400 text-blue-500 hover:bg-blue-50"
              onClick={handleTwitterShare}
            >
              <FaTwitter />
              <span>Twitter</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={handleFacebookShare}
            >
              <FaFacebook />
              <span>Facebook</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 border-pink-600 text-pink-600 hover:bg-pink-50"
              onClick={handleInstagramShare}
            >
              <FaInstagram />
              <span>Instagram</span>
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-1 text-gray-600"
            onClick={handleCopyLink}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Share Text'}</span>
          </Button>
        </div>
        
        {/* Trending hashtags */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Trending Hashtags</p>
          <p className="text-xs text-gray-600 break-words">{generateHashtags()}</p>
        </div>
      </div>
    </div>
  );
}