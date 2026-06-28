"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ScreenshotUploaderProps {
  onUploadSuccess: (data: { publicId: string; secureUrl: string }) => void;
  onRemove: () => void;
}

export function ScreenshotUploader({ onUploadSuccess, onRemove }: ScreenshotUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    // Validate type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setIsSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Get Signature from our Server Action (Mocked for UI Phase, you would import generateUploadSignature)
      // const { signature, timestamp, cloudName, apiKey } = await generateUploadSignature();
      
      // Simulate network latency for upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock Success Data (Normally returned by Cloudinary API)
      const mockResult = {
        publicId: `receipts/mock_${Date.now()}`,
        secureUrl: preview || "",
      };

      setIsSuccess(true);
      onUploadSuccess(mockResult);

    } catch (err) {
      console.error(err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setIsSuccess(false);
    onRemove();
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors">
          <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="font-medium text-sm mb-1">Click to upload payment screenshot</p>
          <p className="text-xs text-muted-foreground mb-4">PNG, JPG up to 5MB</p>
          
          <input
            type="file"
            id="screenshot-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="screenshot-upload" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3">
            Select Image
          </label>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4 bg-muted/10 relative">
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-28 bg-muted rounded-md overflow-hidden flex-shrink-0">
              <Image src={preview} alt="Receipt preview" fill className="object-cover" />
            </div>
            
            <div className="flex-grow pt-2">
              <h4 className="font-medium text-sm truncate w-48">{file?.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {(file?.size ? file.size / (1024 * 1024) : 0).toFixed(2)} MB
              </p>
              
              <div className="mt-4 flex items-center gap-3">
                {!isSuccess ? (
                  <Button 
                    size="sm" 
                    onClick={handleUpload} 
                    disabled={isUploading}
                    className="h-8"
                  >
                    {isUploading ? "Uploading..." : "Confirm Upload"}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle2 size={16} /> Uploaded Successfully
                  </div>
                )}
                
                {!isUploading && (
                  <button 
                    onClick={handleRemove}
                    className="text-xs text-muted-foreground hover:text-destructive underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {isUploading && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-muted rounded-b-lg overflow-hidden">
              <div className="h-full bg-primary animate-pulse w-full origin-left" />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm mt-2">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
