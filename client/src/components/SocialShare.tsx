import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Twitter, 
  Facebook, 
  Instagram, 
  CheckCircle2,
  MessageCircle,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  imageUrl: string;
  title: string;
  description?: string;
  celebrityName: string;
  brandName?: string;
  productName?: string;
  className?: string;
}

export function SocialShare({
  imageUrl,
  title,
  description = '',
  celebrityName,
  brandName,
  productName,
  className = ''
}: SocialShareProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Generate trending hashtags based on celebrity, brand, and product
  const generateHashtags = () => {
    const hashtags = [`#${celebrityName.replace(/\s+/g, '')}Style`];
    
    if (brandName) {
      hashtags.push(`#${brandName.replace(/\s+/g, '')}`);
    }
    
    if (productName) {
      const productHashtag = `#${productName.replace(/[^a-zA-Z0-9]/g, '')}`;
      if (!hashtags.includes(productHashtag)) {
        hashtags.push(productHashtag);
      }
    }
    
    // Add trending fashion hashtags
    hashtags.push('#LumousStyle', '#CelebrityFashion', '#StyleInspiration');
    
    return hashtags.join(' ');
  };
  
  const prepareShareText = () => {
    const hashtags = generateHashtags();
    let text = `Check out ${celebrityName}'s style: ${title}`;
    
    if (brandName) {
      text += ` by ${brandName}`;
    }
    
    if (description) {
      text += `\n\n${description}`;
    }
    
    text += `\n\n${hashtags}`;
    return text;
  };

  const shareToTwitter = () => {
    const text = prepareShareText();
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
    
    toast({
      title: "Shared to Twitter",
      description: "Your post has been prepared for Twitter sharing.",
    });
  };

  const shareToFacebook = () => {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
    
    toast({
      title: "Shared to Facebook",
      description: "Your post has been prepared for Facebook sharing.",
    });
  };

  const shareToInstagram = () => {
    // Since Instagram doesn't have a direct web sharing API,
    // we'll just copy the content for the user
    copyToClipboard();
    
    toast({
      title: "Instagram Sharing",
      description: "Caption copied. Open Instagram app, create a new post with this image, and paste the caption.",
    });
  };

  const copyToClipboard = () => {
    const text = prepareShareText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    
    toast({
      title: "Copied!",
      description: "Share text has been copied to clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = prepareShareText();
  const hashtags = generateHashtags();

  return (
    <div className={`${className}`}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 border-amber-200 text-amber-700 hover:bg-amber-50">
            <Share2 size={16} />
            <span>Share Outfit</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 pb-2">
            <div className="font-medium text-sm mb-3 text-neutral-700">Share this outfit</div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="w-16 h-16 bg-neutral-50 rounded overflow-hidden border border-neutral-100">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-sm font-medium">{title}</div>
                {brandName && (
                  <div className="text-xs text-neutral-500">{brandName}</div>
                )}
              </div>
            </div>
            
            <div className="mb-3">
              <div className="text-xs text-neutral-500 mb-1 font-medium flex items-center gap-1">
                <Hash size={14} /> Trending Hashtags
              </div>
              <div className="text-xs bg-amber-50 p-2 rounded text-amber-800 font-medium border border-amber-100">
                {hashtags}
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="p-2">
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center justify-center h-auto py-3 bg-white"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <CheckCircle2 size={20} className="text-green-500" />
                ) : (
                  <Copy size={20} className="text-neutral-600" />
                )}
                <span className="text-xs mt-1">Copy</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center justify-center h-auto py-3 bg-white"
                onClick={shareToTwitter}
              >
                <Twitter size={20} className="text-[#1DA1F2]" />
                <span className="text-xs mt-1">Twitter</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center justify-center h-auto py-3 bg-white"
                onClick={shareToFacebook}
              >
                <Facebook size={20} className="text-[#4267B2]" />
                <span className="text-xs mt-1">Facebook</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center justify-center h-auto py-3 bg-white"
                onClick={shareToInstagram}
              >
                <Instagram size={20} className="text-[#E1306C]" />
                <span className="text-xs mt-1">Instagram</span>
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="p-3">
            <div className="text-xs text-neutral-500 mb-1">
              Full Post Preview:
            </div>
            <div className="text-xs mb-2 border-l-2 border-amber-300 pl-2 text-neutral-700">
              {shareText}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}