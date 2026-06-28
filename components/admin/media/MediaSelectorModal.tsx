"use client";

import { useState, useEffect } from "react";
import { getMediaLibrary, saveMediaRecord, getCloudinarySignature } from "@/actions/media.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelect: (media: any) => void;
  multiple?: boolean;
}

export function MediaSelectorModal({ open, onOpenChange, onSelect, multiple = false }: MediaSelectorModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      getMediaLibrary().then((data) => {
        setMedia(data);
        setLoading(false);
      });
    }
  }, [open]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds 5MB limit.");
      return;
    }
    
    setUploading(true);
    try {
      const sigData = await getCloudinarySignature();
      if (!sigData.success || !sigData.signature) throw new Error("Failed to get signature");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append("timestamp", sigData.timestamp!.toString());
      formData.append("signature", sigData.signature);
      formData.append("folder", "ser-store");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Upload failed");

      const mediaPayload = {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };

      await saveMediaRecord(mediaPayload);
      toast.success("Image uploaded!");
      
      const updatedMedia = await getMediaLibrary();
      setMedia(updatedMedia);
      
      // Auto-select the newly uploaded image
      if (!multiple) {
        onSelect(mediaPayload);
        onOpenChange(false);
      } else {
        setSelectedIds(prev => [...prev, mediaPayload.publicId]);
      }
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleSelection = (m: any) => {
    if (!multiple) {
      onSelect(m);
      onOpenChange(false);
      return;
    }

    if (selectedIds.includes(m.publicId)) {
      setSelectedIds(selectedIds.filter(id => id !== m.publicId));
    } else {
      setSelectedIds([...selectedIds, m.publicId]);
    }
  };

  const confirmSelection = () => {
    if (multiple) {
      const selectedMedia = media.filter(m => selectedIds.includes(m.publicId));
      onSelect(selectedMedia);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="flex-1 flex flex-col overflow-hidden pt-4">
            {loading ? (
              <div className="flex-1 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : media.length === 0 ? (
              <div className="flex-1 flex justify-center items-center text-muted-foreground border border-dashed rounded-lg p-8">
                No media in library.
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {media.map(m => {
                    const isSelected = selectedIds.includes(m.publicId);
                    return (
                      <div 
                        key={m.publicId} 
                        className={`group relative aspect-square bg-muted rounded-md overflow-hidden border-2 cursor-pointer transition-all ${isSelected ? 'border-primary' : 'border-transparent hover:border-border'}`}
                        onClick={() => toggleSelection(m)}
                      >
                        <Image src={m.secureUrl} alt="Media" fill className="object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-primary bg-background rounded-full" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {multiple && (
              <div className="pt-4 border-t mt-4 flex justify-between items-center flex-shrink-0">
                <span className="text-sm text-muted-foreground">{selectedIds.length} selected</span>
                <Button onClick={confirmSelection} disabled={selectedIds.length === 0}>Confirm Selection</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg mt-4 bg-muted/10">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="modal-media-upload" 
              onChange={handleFileUpload} 
              disabled={uploading}
            />
            <label htmlFor="modal-media-upload" className="flex flex-col items-center justify-center cursor-pointer p-12">
              {uploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-muted-foreground animate-spin mb-4" />
                  <p className="text-lg font-medium">Uploading...</p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Click to select a file</p>
                  <p className="text-sm text-muted-foreground mt-2">Max 5MB (PNG, JPG, WEBP)</p>
                </>
              )}
            </label>
          </TabsContent>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
}
