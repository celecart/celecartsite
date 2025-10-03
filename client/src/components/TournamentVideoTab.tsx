import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { Celebrity } from "@shared/schema";

interface TournamentVideoTabProps {
  celebrity?: Celebrity;
  className?: string;
}

export default function TournamentVideoTab({ celebrity, className = "" }: TournamentVideoTabProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoIndex, setVideoIndex] = useState(0);

  // Collection of video clips for different celebrities
  const celebrityVideos = {
    // Founder - Zulqadar Rehman videos
    100: [{ 
      name: "Rolex Datejust",
      description: "The iconic Rolex Datejust - Light and shade | Luxury Timepiece",
      imageUrl: "/assets/brands/rolex-datejust-new.jpg"
    }, { 
      name: "Ralph Lauren Style Guide",
      description: "Elevate Your Style With Ralph Lauren Purple Label Collection",
      videoId: "WD9AAk2QrcM"
    }, { 
      name: "Lamborghini Urus Performante",
      description: "The Ultimate Super Sports SUV Experience | Lamborghini Official",
      videoId: "e2INSvqgJlw"
    }],
    
    // Tennis players
    1: [{ // Roger Federer
      name: "Roger Federer",
      description: "Wimbledon Championship Highlights",
      videoId: "rf_DrIUI4wU"
    }, {
      name: "Roger Federer",
      description: "Best Points Against Rafael Nadal",
      videoId: "C2c3KcKcLgI"
    }, {
      name: "Roger Federer",
      description: "Tennis Masterclass - Perfect Technique",
      videoId: "jM6lO3K_9zM"
    }],
    2: [{ // Serena Williams
      name: "Serena Williams",
      description: "Power Game Highlights",
      videoId: "QJGQGzcsm1M"
    }, {
      name: "Serena Williams",
      description: "Grand Slam Championship Moments",
      videoId: "QjvMWVdQxEY"
    }, {
      name: "Serena Williams",
      description: "Fashion Evolution On and Off Court",
      videoId: "CRrh_kMG-fQ"
    }],
    3: [{ // Rafael Nadal
      name: "Rafael Nadal",
      description: "King of Clay - Roland Garros Highlights",
      videoId: "1kBQ0KUaOc8"
    }, {
      name: "Rafael Nadal",
      description: "Best Points in Grand Slam History",
      videoId: "D-NxkFIBVNY"
    }, {
      name: "Rafael Nadal",
      description: "Style and Equipment Evolution",
      videoId: "WYlI2VhWlbg"
    }],

    // Boxing
    6: [{ // Floyd Mayweather
      name: "Floyd Mayweather",
      description: "Undefeated Champion Highlights",
      videoId: "ZHIhsLhQ-q8"
    }, {
      name: "Floyd Mayweather",
      description: "Defensive Mastery in the Ring",
      videoId: "Tw20M5aMpDE"
    }, {
      name: "Floyd Mayweather",
      description: "Luxury Lifestyle and Fashion",
      videoId: "xrKAn8rzFIg"
    }],
    12: [{ // Amir Khan
      name: "Amir Khan",
      description: "Speed and Power Combinations",
      videoId: "1RlRuMBfSQ8"
    }, {
      name: "Amir Khan",
      description: "Championship Fights Highlights",
      videoId: "KG-Y6yvGwkE"
    }, {
      name: "Amir Khan",
      description: "Training and Fighting Style",
      videoId: "u5uBvKOOTJE"
    }],
    // Soccer players
    9: [{ // Angelina Jolie
      name: "Angelina Jolie",
      description: "Red Carpet Fashion Highlights",
      videoId: "Kf6Y2XswXKA"
    }, {
      name: "Angelina Jolie",
      description: "Style Evolution Through the Years",
      videoId: "vZGHg5q5Qiw"
    }, {
      name: "Angelina Jolie",
      description: "Atelier Jolie Brand and Fashion Evolution",
      videoId: "I9vqsuEj5oo"
    }],
    // Pakistani Celebrities
    13: [{ // Fawad Khan
      name: "Fawad Khan",
      description: "Acting and Fashion Highlights",
      videoId: "qEcT5DOMlb4"
    }, {
      name: "Fawad Khan",
      description: "Red Carpet Style Moments",
      videoId: "0H9XzD9_w-c"
    }],
    14: [{ // Shoaib Akhtar
      name: "Shoaib Akhtar",
      description: "Fastest Bowling in Cricket History",
      videoId: "JdbEjZFuA1g"
    }, {
      name: "Shoaib Akhtar",
      description: "The Rawalpindi Express in Action",
      videoId: "UX6gqh4_ZDE"
    }],
    16: [{ // Imran Khan
      name: "Imran Khan",
      description: "Cricket Career Highlights",
      videoId: "Hx9D9D7Ls8Q"
    }, {
      name: "Imran Khan",
      description: "World Cup Victory and Style",
      videoId: "KwTuLihrILQ"
    }],
    17: [{ // Hania Amir
      name: "Hania Amir",
      description: "Style Evolution and Fashion",
      videoId: "j5fRHjCHChY"
    }, {
      name: "Hania Amir",
      description: "Red Carpet and Photoshoot Moments",
      videoId: "QMdCgGNcxbA"
    }],
    // Kardashians
    15: [{ // Kim Kardashian - Episode Style Series & Tutorials
      name: "Kim Kardashian: Wedding Makeup",
      description: "Kim Kardashian's Wedding Makeup Tutorial",
      videoId: "2DER4HCb4j8"
    }, {
      name: "Kim Kardashian: Full Face",
      description: "Full Face Using Kim Kardashian's Makeup",
      videoId: "VmuzlW1NfL8"
    }, {
      name: "Kim Kardashian: SKKN Skincare",
      description: "Full SKKN By Kim Kardashian Skincare Routine Review",
      videoId: "jQ5xAD5e5Jw"
    }, {
      name: "Kim Kardashian: Beauty Tutorial",
      description: "Kim Kardashian SKKN Beauty Secrets Tutorial",
      videoId: "QPLTzL5fzF4"
    }, {
      name: "Kim Kardashian: Makeup Collection",
      description: "Kim Kardashian SKKN Makeup Line Review",
      videoId: "aaC5raOn4YA"
    }, {
      name: "Kim Kardashian: Met Gala 2022",
      description: "Kim Kardashian's Iconic Met Gala Marilyn Monroe Look",
      videoId: "kc4svMRd4bo"
    }, {
      name: "Kim Kardashian: Viral Contour",
      description: "Kim Kardashian's Famous Contour Technique Tutorial",
      videoId: "WeD78cjVvZk"
    }, {
      name: "Kim Kardashian: Everyday Glam",
      description: "Get Ready With Me: Kim Kardashian Inspired Look",
      videoId: "gx5YNP6BV3k"
    }],
    18: [{ // Kendall Jenner
      name: "Kendall Jenner",
      description: "Runway Highlights & Top Model Moments",
      videoId: "gx9bGFjxaik"
    }, {
      name: "Kendall Jenner",
      description: "Fashion Week Appearances",
      videoId: "c47NU-ACxbY"
    }, {
      name: "Kendall Jenner",
      description: "Street Style and Fashion Brands",
      videoId: "zY9_bxTBn6c"
    }],
    19: [{ // Kylie Jenner
      name: "Kylie Jenner",
      description: "Fashion and Beauty Brand Empire",
      videoId: "3NJ61cLMyek"
    }, {
      name: "Kylie Jenner",
      description: "Red Carpet and Met Gala Looks",
      videoId: "iCbkjtz_U_Q"
    }],
    20: [{ // Kourtney Kardashian
      name: "Kourtney Kardashian",
      description: "Style Evolution and Brand Collaborations",
      videoId: "1NKvxgEGXx0"
    }, {
      name: "Kourtney Kardashian",
      description: "Fashion and Lifestyle Highlights",
      videoId: "LuHbgMQxqV8"
    }],
    21: [{ // Khloe Kardashian
      name: "Khloe Kardashian",
      description: "Good American Brand and Fashion Line",
      videoId: "RQdY_mF2PXQ"
    }, {
      name: "Khloe Kardashian",
      description: "Style Transformation Through Years",
      videoId: "wgH1sn0NeRU"
    }],
    
    // Actors and Musicians
    22: [{ // Tom Cruise
      name: "Tom Cruise",
      description: "Red Carpet Fashion Evolution",
      videoId: "YtEGGjbM7TM"
    }, {
      name: "Tom Cruise",
      description: "Iconic Movie Fashion Moments",
      videoId: "Zz9oI3B6v4c"
    }, {
      name: "Tom Cruise",
      description: "Style Journey Through Decades",
      videoId: "bMtNs4Jofzs"
    }],
    23: [{ // Drake
      name: "Drake",
      description: "Fashion Evolution and Brand Partnerships",
      videoId: "cimoNqiulUE"
    }, {
      name: "Drake",
      description: "Stage Performance Style Highlights",
      videoId: "vcer12OFU2g"
    }, {
      name: "Drake",
      description: "Streetwear & Luxury Fashion Influence",
      videoId: "U0CGsw6h60k"
    }],
    24: [{ // Salman Khan
      name: "Salman Khan",
      description: "Bollywood Style Icon Through Years",
      videoId: "YUZxqvnryyU"
    }, {
      name: "Salman Khan",
      description: "Red Carpet and Award Show Fashion",
      videoId: "KhSyJ4RWn3U"
    }, {
      name: "Salman Khan",
      description: "Movie Character Style Evolution",
      videoId: "3fJfvU_17M8"
    }]
  };

  // Default videos for when celebrity is not specified or no videos exist
  const defaultVideos = [
    {
      name: "Roger Federer",
      description: "Wimbledon Championship Highlights",
      videoId: "rf_DrIUI4wU"
    },
    {
      name: "Amir Khan",
      description: "Speed and Power Combinations",
      videoId: "1RlRuMBfSQ8"
    },
    {
      name: "Angelina Jolie",
      description: "Red Carpet Fashion Highlights",
      videoId: "Kf6Y2XswXKA"
    },
    {
      name: "Serena Williams",
      description: "Power Game Highlights",
      videoId: "QJGQGzcsm1M"
    },
    {
      name: "Tom Cruise",
      description: "Iconic Movie Fashion Moments",
      videoId: "Zz9oI3B6v4c"
    },
    {
      name: "Drake",
      description: "Fashion Evolution and Brand Partnerships",
      videoId: "cimoNqiulUE"
    },
    {
      name: "Salman Khan",
      description: "Bollywood Style Icon Through Years",
      videoId: "YUZxqvnryyU"
    },
    {
      name: "Kim Kardashian: Wedding Makeup",
      description: "Kim Kardashian's Wedding Makeup Tutorial",
      videoId: "2DER4HCb4j8"
    },
    {
      name: "Fawad Khan",
      description: "Acting and Fashion Highlights",
      videoId: "qEcT5DOMlb4"
    },
    {
      name: "Shoaib Akhtar",
      description: "Fastest Bowling in Cricket History",
      videoId: "JdbEjZFuA1g"
    }
  ];

  // Get the videos for this celebrity or use defaults
  const getVideosForCelebrity = () => {
    if (celebrity && celebrity.id && celebrityVideos[celebrity.id as keyof typeof celebrityVideos]) {
      return celebrityVideos[celebrity.id as keyof typeof celebrityVideos];
    }
    return defaultVideos;
  };

  const videos = getVideosForCelebrity();

  // Auto-rotate videos every 30 seconds if playing is enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, videos.length]);

  const currentVideo = videos[videoIndex];
  
  // Determine if the current item is an image or a video
  const isImage = 'imageUrl' in currentVideo;
  
  // Construct YouTube embed URL with proper parameters (only for videos)
  const videoUrl = !isImage ? `https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${currentVideo.videoId}&showinfo=0&rel=0&modestbranding=1` : '';

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const prevVideo = () => {
    setVideoIndex((prevIndex) => 
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };
  
  const nextVideo = () => {
    setVideoIndex((prevIndex) => 
      (prevIndex + 1) % videos.length
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-8 border border-amber-200 shadow-lg mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-playfair font-bold mb-3 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent">
              {celebrity && celebrity.id === 15 
                ? `${celebrity.name}'s Fashion & Style Episodes` 
                : celebrity 
                  ? `${celebrity.name}'s Tournament Videos` 
                  : "Celebrity Fashion Episodes"
              }
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {celebrity && celebrity.id === 15 
                ? `Discover the fashion empire behind ${celebrity.name}. From makeup tutorials to business insights, explore the complete style journey that transformed beauty and fashion industries forever.`
                : `Watch exclusive footage of ${celebrity?.name || "our celebrities"} in action during tournaments and events. See their performance style, equipment choices, and fashion statements in real competitive environments.`
              }
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">🎬 Episodes</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">💄 Tutorials</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">👗 Style Guide</span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">💼 Business</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Player Section */}
      <div className="bg-gradient-to-br from-neutral-900 via-gray-800 to-neutral-900 rounded-2xl p-6 shadow-2xl mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/20 rounded-full">
            <Play className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-2xl font-playfair font-bold text-white">Now Playing</h3>
            <p className="text-gray-300">Episode {videoIndex + 1} of {videos.length}</p>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full rounded-xl overflow-hidden aspect-video shadow-2xl group border border-amber-500/20"
          key={isImage ? `image-${videoIndex}` : currentVideo.videoId}
        >
        {/* Video Player or Image */}
        <div className="relative w-full h-full">
          {isImage ? (
            <img 
              src={(currentVideo as any).imageUrl} 
              alt={currentVideo.name}
              className="absolute top-0 left-0 w-full h-full object-contain bg-black"
            />
          ) : (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={videoUrl}
              title={`${currentVideo.name} Video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
          
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
          
          {/* Video Controls - Only show for videos */}
          {!isImage && (
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
          )}
        </div>
        </motion.div>
      </div>
      
      {/* Episode Playlist */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Video className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-xl font-playfair font-bold text-amber-700">Episode Playlist</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video, index) => (
            <div 
              key={index}
              onClick={() => setVideoIndex(index)}
              className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                videoIndex === index
                  ? "border-amber-500 shadow-lg scale-[1.02]"
                  : "border-amber-200 hover:border-amber-400 hover:shadow-md"
              }`}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                {(video as any).imageUrl ? (
                  <img 
                    src={(video as any).imageUrl} 
                    alt={video.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-100 to-orange-100">
                    <Play className="w-8 h-8 text-amber-500" />
                  </div>
                )}
                
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className={`w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transform transition-all duration-300 ${
                    videoIndex === index ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                  }`}>
                    <Play className="w-6 h-6 text-amber-600 ml-1" />
                  </div>
                </div>
                
                {/* Episode indicator */}
                <div className="absolute top-2 left-2">
                  <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    EP {index + 1}
                  </span>
                </div>
                
                {/* Current playing indicator */}
                {videoIndex === index && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      NOW
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
                  {video.name}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {celebrity?.id === 15 
              ? `${videos.length} exclusive episodes featuring ${celebrity.name}'s fashion journey and beauty empire`
              : `${videos.length} videos showcasing ${celebrity?.name || "celebrity"} highlights and style evolution`
            }
          </p>
        </div>
      </div>
    </div>
  );
}