import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Video, X, CheckCircle, Loader2, Radio, Camera, Share2, Info, Trash2, Heart, MessageCircle, Sparkles, Play, Smile, Share, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MediaFile = {
  file: File;
  preview: string;
  type: 'image' | 'video';
  uploading: boolean;
  uploaded: boolean;
  error?: string;
};

export default function MediaUpload() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [isGoingLive, setIsGoingLive] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');
  const [liveDescription, setLiveDescription] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [previewStream, setPreviewStream] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newMediaFiles = acceptedFiles.map(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        toast({
          title: "Invalid file type",
          description: "Only image and video files are supported",
          variant: "destructive"
        });
        return null;
      }
      
      return {
        file,
        preview: URL.createObjectURL(file),
        type: isImage ? 'image' : 'video',
        uploading: false,
        uploaded: false
      } as MediaFile;
    }).filter(Boolean) as MediaFile[];
    
    setMediaFiles(prev => [...prev, ...newMediaFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxSize: 100 * 1024 * 1024 // 100MB limit
  });

  const handleUpload = async (index: number) => {
    const mediaFile = mediaFiles[index];
    
    // Update state to show uploading
    setMediaFiles(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], uploading: true, error: undefined };
      return updated;
    });
    
    // Mock upload delay - in a real app, you'd use FormData to send to server
    setTimeout(() => {
      setMediaFiles(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], uploading: false, uploaded: true };
        return updated;
      });
      
      toast({
        title: "Upload successful",
        description: `${mediaFile.file.name} has been uploaded.`,
        variant: "default"
      });
    }, 2000);
  };

  const handleRemove = (index: number) => {
    setMediaFiles(prev => {
      const updated = [...prev];
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(updated[index].preview);
      return updated.filter((_, i) => i !== index);
    });
  };
  
  // Livestream functionality
  useEffect(() => {
    // Clean up when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (previewStream) {
        URL.revokeObjectURL(previewStream);
      }
    };
  }, [previewStream]);
  
  const startStream = async () => {
    try {
      setIsGoingLive(true);
      
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      
      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Event handlers for recorder
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      
      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsLiveStreaming(true);
      setIsGoingLive(false);
      
      toast({
        title: "Livestream started",
        description: "You're now live! Your fans can see your stream.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsGoingLive(false);
      
      toast({
        title: "Livestream error",
        description: "Could not access your camera or microphone. Please check your permissions.",
        variant: "destructive"
      });
    }
  };
  
  const stopStream = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Create a recording from the chunks
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setPreviewStream(url);
      
      // Create a virtual file for the recording
      const now = new Date();
      const fileName = `livestream-${now.toISOString().replace(/[:.]/g, '-')}.webm`;
      const file = new File([blob], fileName, { type: 'video/webm' });
      
      // Add to media files
      setMediaFiles(prev => [
        ...prev, 
        {
          file,
          preview: url,
          type: 'video',
          uploading: false,
          uploaded: false
        }
      ]);
      
      // Reset recorded chunks
      setRecordedChunks([]);
    }
    
    setIsLiveStreaming(false);
    
    toast({
      title: "Livestream ended",
      description: "Your stream has ended. The recording has been saved.",
      variant: "default"
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Instagram-style header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-0.5">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">AI Stylist Rose</h2>
            <p className="text-xs text-neutral-500">Active now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <Heart className="w-5 h-5 text-neutral-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <MessageCircle className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>
      
      <div className="space-y-10">
        {/* Instagram-style Upload Section */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          {/* Story-like create section */}
          <div className="p-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Camera className="h-4 w-4 text-purple-500" />
                </div>
              </div>
              <div 
                {...getRootProps()}
                className={`flex-1 cursor-pointer transition-all ${
                  isDragActive 
                    ? 'bg-blue-50 border-blue-300' 
                    : 'bg-neutral-50 hover:bg-neutral-100'
                } rounded-full px-4 py-2 border border-neutral-200`}
              >
                <input {...getInputProps()} />
                <p className="text-neutral-500 text-sm">
                  {isDragActive ? 'Drop your photos here...' : "What's on your mind?"}
                </p>
              </div>
            </div>
            
            {/* Quick action buttons */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <button 
                  {...getRootProps()}
                  className="flex items-center gap-2 text-sm text-neutral-600 hover:text-blue-600 transition-colors"
                >
                  <input {...getInputProps()} />
                  <Camera className="w-4 h-4 text-green-500" />
                  Photo
                </button>
                <button 
                  {...getRootProps()}
                  className="flex items-center gap-2 text-sm text-neutral-600 hover:text-blue-600 transition-colors"
                >
                  <input {...getInputProps()} />
                  <Video className="w-4 h-4 text-red-500" />
                  Video
                </button>
                <button className="flex items-center gap-2 text-sm text-neutral-600 hover:text-blue-600 transition-colors">
                  <Smile className="w-4 h-4 text-yellow-500" />
                  Feeling
                </button>
              </div>
              {mediaFiles.length > 0 && (
                <Badge className="bg-blue-50 text-blue-600 border-blue-200">
                  {mediaFiles.length} ready
                </Badge>
              )}
            </div>
          </div>
          
          {/* Drag and drop area when active */}
          {isDragActive && (
            <div className="p-8 text-center bg-blue-50 border-2 border-dashed border-blue-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-blue-600 font-medium">Drop to upload</p>
              <p className="text-blue-500 text-sm mt-1">Photos and videos supported</p>
            </div>
          )}
        </div>

        {/* Livestream Section */}
        <div className="rounded-xl overflow-hidden shadow-sm border border-neutral-100">
          <div className="aspect-video relative bg-neutral-50">
            {!isLiveStreaming && !previewStream && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-4 shadow-md">
                  <Radio className="w-10 h-10 text-white" />
                </div>
                <p className="text-center max-w-md text-neutral-500 text-sm font-medium">
                  Go live for a real-time styling session with Rose
                </p>
              </div>
            )}
            
            {(isLiveStreaming || isGoingLive) && (
              <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                <Badge className="rounded-full px-3 py-1 bg-red-600 text-white border-transparent flex items-center gap-2">
                  <div className="animate-pulse h-2 w-2 rounded-full bg-white"></div>
                  <span>LIVE</span>
                </Badge>
              </div>
            )}
            
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              muted={false} 
              className={`w-full h-full object-cover ${!isLiveStreaming && !previewStream ? 'opacity-20' : ''}`}
              controls={!!previewStream}
              src={previewStream || undefined}
            />
          </div>
          
          {/* Livestream controls */}
          <div className="p-6 bg-white border-t border-neutral-100">
            {!isLiveStreaming ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Live Title</label>
                  <input
                    type="text"
                    placeholder="What are you sharing today?"
                    value={liveTitle}
                    onChange={(e) => setLiveTitle(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-neutral-200 text-neutral-800 focus:border-blue-400 focus:ring-blue-200 focus:ring-1 focus:outline-none"
                    disabled={isGoingLive}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Description (optional)</label>
                  <textarea
                    placeholder="Tell your followers what they'll see in this stream..."
                    value={liveDescription}
                    onChange={(e) => setLiveDescription(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-neutral-200 text-neutral-800 focus:border-blue-400 focus:ring-blue-200 focus:ring-1 focus:outline-none h-20 resize-none"
                    disabled={isGoingLive}
                  />
                </div>
                
                <Button
                  onClick={startStream}
                  disabled={isGoingLive || !liveTitle}
                  className={`w-full rounded-lg ${
                    isGoingLive || !liveTitle
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700'
                  }`}
                >
                  {isGoingLive ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      <span>Setting up stream...</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-5 h-5 mr-2" />
                      <span>Go Live</span>
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-800">{liveTitle}</h3>
                    <p className="text-neutral-500 text-sm">
                      {new Date().toLocaleTimeString()} • Live now
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full px-3 py-1 bg-neutral-900 text-white border-transparent flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>128</span>
                    </Badge>
                  </div>
                </div>
                
                <Button
                  onClick={stopStream}
                  className="w-full rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  <X className="w-5 h-5 mr-2" />
                  <span>End Stream</span>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Instagram-style stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-neutral-50 p-4 border border-neutral-100">
            <div className="text-xl font-semibold text-neutral-800">17.8K</div>
            <div className="text-xs text-neutral-500 mt-1">Total Views</div>
          </div>
          <div className="rounded-lg bg-neutral-50 p-4 border border-neutral-100">
            <div className="text-xl font-semibold text-neutral-800">3.2K</div>
            <div className="text-xs text-neutral-500 mt-1">Likes</div>
          </div>
          <div className="rounded-lg bg-neutral-50 p-4 border border-neutral-100">
            <div className="text-xl font-semibold text-neutral-800">452</div>
            <div className="text-xs text-neutral-500 mt-1">Comments</div>
          </div>
        </div>
        
        {/* Tips for successful streaming */}
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-rose-800">AI Stylist Tips</h4>
              <ul className="text-xs text-neutral-600 mt-2 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-rose-400"></div>
                  Upload clear, well-lit photos for the best AI style analysis
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-rose-400"></div>
                  Rose can identify brands, suggest similar items, and offer styling advice
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-rose-400"></div>
                  Try going live to get real-time feedback on your outfit choices
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-rose-400"></div>
                  Share your AI-styled looks with friends for even more inspiration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Instagram-style Preview Grid */}
      {mediaFiles.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900">Ready to share</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200">
                  {mediaFiles.length} {mediaFiles.length === 1 ? 'item' : 'items'}
                </Badge>
                <button 
                  onClick={() => {
                    mediaFiles.forEach(file => URL.revokeObjectURL(file.preview));
                    setMediaFiles([]);
                  }}
                  className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            >
              {mediaFiles.map((mediaFile, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100 group"
                >
                  {mediaFile.type === 'image' ? (
                    <img
                      src={mediaFile.preview}
                      alt={mediaFile.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      <video
                        src={mediaFile.preview}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full p-1.5">
                        <Play className="w-3 h-3 text-white" />
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        Video
                      </div>
                    </div>
                  )}
                  
                  {/* Instagram-style overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpload(index)}
                        disabled={mediaFile.uploading || mediaFile.uploaded}
                        className="p-2 rounded-full bg-white/90 text-blue-600 hover:bg-white transition-colors disabled:opacity-50"
                        title="Share"
                      >
                        {mediaFile.uploaded ? <Check size={16} /> : <Share size={16} />}
                      </button>
                      <button
                        onClick={() => handleRemove(index)}
                        className="p-2 rounded-full bg-white/90 text-red-500 hover:bg-white transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Status indicators */}
                  {mediaFile.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      </div>
                    </div>
                  )}
                  
                  {mediaFile.uploaded && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  
                  {mediaFile.error && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-2 text-center">
                      Upload failed
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
            
            {/* Instagram-style action bar */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    const pendingFiles = mediaFiles.filter(file => !file.uploaded && !file.uploading);
                    pendingFiles.forEach((_, index) => {
                      const realIndex = mediaFiles.findIndex((file, i) => 
                        !file.uploaded && !file.uploading && i >= index
                      );
                      if (realIndex >= 0) {
                        setTimeout(() => handleUpload(realIndex), index * 500);
                      }
                    });
                  }}
                  disabled={mediaFiles.every(file => file.uploaded || file.uploading)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  <Share className="w-4 h-4" />
                  Share All
                </button>
                <span className="text-neutral-500 text-sm">
                  {mediaFiles.filter(f => f.uploaded).length} of {mediaFiles.length} shared
                </span>
              </div>
              
              <button
                onClick={() => {
                  mediaFiles.forEach(file => URL.revokeObjectURL(file.preview));
                  setMediaFiles([]);
                }}
                className="text-neutral-400 hover:text-red-500 transition-colors p-2"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Published Posts Section */}
      <div className="mt-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></div>
          <h3 className="text-lg font-medium text-neutral-800">Published Posts</h3>
          {mediaFiles.filter(file => file.uploaded).length > 0 && (
            <Badge className="rounded-full px-3 py-1 bg-green-50 text-green-600 border-transparent ml-2">
              {mediaFiles.filter(file => file.uploaded).length}
            </Badge>
          )}
        </div>
        
        {mediaFiles.filter(file => file.uploaded).length > 0 ? (
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {mediaFiles.filter(file => file.uploaded).map((mediaFile, index) => (
              <motion.div
                key={`uploaded-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group aspect-square overflow-hidden"
              >
                {mediaFile.type === 'image' ? (
                  <img
                    src={mediaFile.preview}
                    alt={mediaFile.file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full">
                    <video
                      src={mediaFile.preview}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 text-white">
                      <Video size={16} className="drop-shadow-md" />
                    </div>
                  </div>
                )}
                
                {/* Instagram-like hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                      <Heart className="w-6 h-6 text-white" />
                      <span className="text-white text-xs mt-1 font-medium">128</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                      <span className="text-white text-xs mt-1 font-medium">24</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Share2 className="w-6 h-6 text-white" />
                      <span className="text-white text-xs mt-1 font-medium">Share</span>
                    </div>
                  </div>
                </div>
                
                {/* Published indicator */}
                <div className="absolute top-2 left-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 p-1 shadow-sm">
                  <CheckCircle size={12} className="text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-xl bg-neutral-50 border border-neutral-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-md">
              <ImageIcon className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-medium text-neutral-800 mb-2">Your gallery is empty</h4>
            <p className="text-neutral-500 max-w-md mx-auto text-sm">
              Share your photos and videos with followers. Your published content will appear here.
            </p>
            <Button 
              className="mt-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full px-6"
            >
              <Upload className="w-4 h-4 mr-2" />
              Create New Post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}