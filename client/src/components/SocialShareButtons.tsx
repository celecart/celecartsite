import React from 'react';
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

interface SocialShareButtonsProps {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  className?: string;
}

export default function SocialShareButtons({ 
  title, 
  description, 
  imageUrl, 
  url, 
  className = "" 
}: SocialShareButtonsProps) {
  // Use current URL if not provided
  const shareUrl = url || window.location.href;
  
  // Prepare shared content
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedUrl = encodeURIComponent(shareUrl);
  
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "URL has been copied to your clipboard.",
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Failed to copy link",
        description: "Please try again.",
        variant: "destructive"
      });
    });
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full p-2"
              onClick={() => openShareWindow(twitterShareUrl)}
            >
              <Twitter className="w-5 h-5 text-[#1DA1F2]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Twitter</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full p-2"
              onClick={() => openShareWindow(facebookShareUrl)}
            >
              <Facebook className="w-5 h-5 text-[#4267B2]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Facebook</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full p-2"
              onClick={() => openShareWindow(linkedinShareUrl)}
            >
              <Linkedin className="w-5 h-5 text-[#0077b5]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on LinkedIn</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full p-2"
              onClick={handleCopyLink}
            >
              <LinkIcon className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy Link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}