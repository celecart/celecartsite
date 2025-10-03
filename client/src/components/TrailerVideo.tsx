import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";

interface TrailerVideoProps {
  className?: string;
}

export default function TrailerVideo({ className = "" }: TrailerVideoProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoIndex, setVideoIndex] = useState(0);

  // Collection of video clips featuring celebrities in action
  const celebrityVideos = [
    {
      name: "Roger Federer",
      description: "Tennis Legend in Action",
      videoId: "rf_DrIUI4wU"
    },
    {
      name: "Amir Khan",
      description: "Boxing Champion's Greatest Fights",
      videoId: "1RlRuMBfSQ8"
    },
    {
      name: "Angelina Jolie",
      description: "Hollywood Icon's Fashion Evolution",
      videoId: "Kf6Y2XswXKA"
    },
    {
      name: "Serena Williams",
      description: "Tennis Champion's Power Plays",
      videoId: "QJGQGzcsm1M"
    },
    {
      name: "Kim Kardashian",
      description: "Fashion Icon's Style Evolution",
      videoId: "EFXu-AxykRo"
    }
  ];

  // Auto-rotate videos every 30 seconds if playing is enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoIndex((prevIndex) => (prevIndex + 1) % celebrityVideos.length);
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, celebrityVideos.length]);

  const currentVideo = celebrityVideos[videoIndex];
  
  // Construct YouTube embed URL with proper parameters
  const videoUrl = `https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${currentVideo.videoId}&showinfo=0&rel=0&modestbranding=1`;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const prevVideo = () => {
    setVideoIndex((prevIndex) => 
      prevIndex === 0 ? celebrityVideos.length - 1 : prevIndex - 1
    );
  };
  
  const nextVideo = () => {
    setVideoIndex((prevIndex) => 
      (prevIndex + 1) % celebrityVideos.length
    );
  };

  return (
    <section className={`relative w-full ${className}`}>
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 font-playfair">
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Elite Celebrities In Action
          </span>
        </h2>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full rounded-xl overflow-hidden aspect-video shadow-2xl group"
          key={currentVideo.videoId} // Add key to force remount when video changes
        >
          {/* Video Player */}
          <div className="relative w-full h-full">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={videoUrl}
              title={`${currentVideo.name} Video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            
            {/* Video Overlay with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
            
            {/* Navigation Arrows - Left */}
            <button 
              onClick={prevVideo}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            {/* Navigation Arrows - Right */}
            <button 
              onClick={nextVideo}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next video"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            
            {/* Celebrity Name and Description */}
            <div className="absolute bottom-8 left-8 z-10 text-white">
              <h3 className="text-2xl md:text-3xl font-bold font-playfair">{currentVideo.name}</h3>
              <p className="text-lg opacity-90">{currentVideo.description}</p>
            </div>
            
            {/* Video Controls */}
            <div className="absolute bottom-8 right-8 flex items-center space-x-4 z-10">
              <button 
                onClick={toggleMute}
                className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
              </button>
              <button 
                onClick={togglePlay}
                className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Video Selector Dots */}
        <div className="flex justify-center mt-6">
          {celebrityVideos.map((video, index) => (
            <button
              key={index}
              onClick={() => setVideoIndex(index)}
              className={`mx-1 w-3 h-3 rounded-full transition-all ${
                videoIndex === index
                  ? "bg-primary scale-125"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
              aria-label={`Watch ${video.name} video`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}