import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

type ImageFile = {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  error?: string;
};

interface MultiImageUploadProps {
  onImagesChange: (imageUrls: string[]) => void;
  initialImages?: string[];
  maxFiles?: number;
  disabled?: boolean;
}

export default function MultiImageUpload({ 
  onImagesChange, 
  initialImages = [], 
  maxFiles = 10,
  disabled = false 
}: MultiImageUploadProps) {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>(() => {
    // Initialize with existing images if provided
    return initialImages.map(url => ({
      file: new File([], 'existing'), // Placeholder file for existing images
      preview: url,
      uploading: false,
      uploaded: true,
      url: url
    }));
  });
  
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (disabled) return;
    
    const currentCount = imageFiles.length;
    const availableSlots = maxFiles - currentCount;
    
    if (acceptedFiles.length > availableSlots) {
      toast({
        title: "Too many files",
        description: `You can only upload ${availableSlots} more image(s). Maximum ${maxFiles} images allowed.`,
        variant: "destructive"
      });
      acceptedFiles = acceptedFiles.slice(0, availableSlots);
    }

    const newImageFiles = acceptedFiles.map(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Only image files are supported",
          variant: "destructive"
        });
        return null;
      }
      
      return {
        file,
        preview: URL.createObjectURL(file),
        uploading: false,
        uploaded: false
      };
    }).filter(Boolean) as ImageFile[];

    setImageFiles(prev => {
      const updated = [...prev, ...newImageFiles];
      // Automatically upload the new images
      setTimeout(() => uploadNewImages(newImageFiles), 100);
      return updated;
    });
  }, [imageFiles.length, maxFiles, disabled, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    disabled
  });

  const uploadNewImages = async (filesToUpload: ImageFile[]) => {
    if (filesToUpload.length === 0) return;

    // Mark files as uploading
    setImageFiles(prev => prev.map(img => 
      filesToUpload.some(f => f.file === img.file) ? { ...img, uploading: true, error: undefined } : img
    ));

    try {
      const formData = new FormData();
      filesToUpload.forEach(imageFile => {
        formData.append('images', imageFile.file);
      });

      const response = await fetch('/api/upload/product-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const uploadedUrls = result.imageUrls;

      // Update files with uploaded URLs
      setImageFiles(prev => {
        const updated = prev.map(img => {
          const uploadIndex = filesToUpload.findIndex(f => f.file === img.file);
          if (uploadIndex !== -1) {
            return {
              ...img,
              uploading: false,
              uploaded: true,
              url: uploadedUrls[uploadIndex]
            };
          }
          return img;
        });
        
        // Notify parent component of the change
        const allUrls = updated.filter(img => img.uploaded && img.url).map(img => img.url!);
        onImagesChange(allUrls);
        
        return updated;
      });

      toast({
        title: "Upload successful",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      // Mark failed uploads
      setImageFiles(prev => prev.map(img => 
        filesToUpload.some(f => f.file === img.file) 
          ? { ...img, uploading: false, error: 'Upload failed' }
          : img
      ));

      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    }
  };

  const uploadImages = async () => {
    const filesToUpload = imageFiles.filter(img => !img.uploaded && !img.uploading);
    
    if (filesToUpload.length === 0) return;

    // Mark files as uploading
    setImageFiles(prev => prev.map(img => 
      filesToUpload.some(f => f.file === img.file) ? { ...img, uploading: true, error: undefined } : img
    ));

    try {
      const formData = new FormData();
      filesToUpload.forEach(imageFile => {
        formData.append('images', imageFile.file);
      });

      const response = await fetch('/api/upload/product-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const uploadedUrls = result.imageUrls;

      // Update files with uploaded URLs
      setImageFiles(prev => {
        const updated = prev.map(img => {
          const uploadIndex = filesToUpload.findIndex(f => f.file === img.file);
          if (uploadIndex !== -1) {
            return {
              ...img,
              uploading: false,
              uploaded: true,
              url: uploadedUrls[uploadIndex]
            };
          }
          return img;
        });
        
        // Notify parent component of the change
        const allUrls = updated.filter(img => img.uploaded && img.url).map(img => img.url!);
        onImagesChange(allUrls);
        
        return updated;
      });

      toast({
        title: "Upload successful",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      // Mark failed uploads
      setImageFiles(prev => prev.map(img => 
        filesToUpload.some(f => f.file === img.file) 
          ? { ...img, uploading: false, error: 'Upload failed' }
          : img
      ));

      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeImage = (index: number) => {
    if (disabled) return;
    
    setImageFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      const allUrls = updated.filter(img => img.uploaded && img.url).map(img => img.url!);
      onImagesChange(allUrls);
      return updated;
    });
  };

  const hasUnuploadedFiles = imageFiles.some(img => !img.uploaded && !img.uploading);
  const isUploading = imageFiles.some(img => img.uploading);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${imageFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <ImageIcon className="h-8 w-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            {isDragActive ? (
              <p>Drop the images here...</p>
            ) : (
              <div>
                <p>Drag & drop images here, or click to select</p>
                <p className="text-xs text-gray-500 mt-1">
                  {imageFiles.length}/{maxFiles} images • PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Grid */}
      {imageFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {imageFiles.map((imageFile, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={imageFile.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    {!disabled && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Status Indicators */}
                  {imageFile.uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                  
                  {imageFile.error && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                  )}
                  
                  {imageFile.uploaded && !imageFile.error && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-green-500 rounded-full p-1">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Button */}
      {hasUnuploadedFiles && (
        <div className="flex justify-center">
          <Button 
            onClick={uploadImages}
            disabled={isUploading || disabled}
            className="flex items-center space-x-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Upload Images</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}