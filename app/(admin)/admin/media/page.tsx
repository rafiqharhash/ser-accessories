"use client";

import { useState, useEffect } from "react";
import { getMediaLibrary, deleteMediaRecord, saveMediaRecord, getCloudinarySignature } from "@/actions/media.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, UploadCloud, Trash2, Search, ExternalLink, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function MediaLibraryPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMedia = async () => {
    setLoading(true);
    const data = await getMediaLibrary();
    setMedia(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Quick validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds 5MB limit.");
      return;
    }
    
    setUploading(true);
    try {
      // 1. Get Signature
      const sigData = await getCloudinarySignature();
      if (!sigData.success || !sigData.signature) throw new Error("Failed to get signature");

      // 2. Upload to Cloudinary
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

      // 3. Save to our DB Media Library
      const mediaPayload = {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };

      await saveMediaRecord(mediaPayload);
      toast.success("Image uploaded to library.");
      fetchMedia();
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Are you sure you want to delete this image? It will break if it's currently assigned to a product.")) return;
    
    const res = await deleteMediaRecord(publicId);
    if (res.success) {
      toast.success("Image deleted from library.");
      fetchMedia();
    } else {
      toast.error(res.error);
    }
  };

  const filteredMedia = media.filter(m => m.publicId.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-playfair mb-2 flex items-center gap-2">
            <ImageIcon className="w-8 h-8" /> Media Library
          </h1>
          <p className="text-muted-foreground">Manage all uploaded images and videos.</p>
        </div>
        <div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            id="media-upload" 
            onChange={handleFileUpload} 
          />
          <label htmlFor="media-upload" className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
            {uploading ? "Uploading..." : "Upload New Media"}
          </label>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search by filename or ID..." 
          className="pl-9 bg-background"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="border border-border rounded-lg border-dashed p-12 text-center text-muted-foreground bg-muted/20">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No media found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map(m => (
            <div key={m._id} className="group relative aspect-square bg-muted rounded-lg overflow-hidden border border-border">
              <Image 
                src={m.secureUrl} 
                alt="Media item" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Hover Overlay Controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end gap-1">
                  <Button variant="secondary" size="icon" className="w-7 h-7" onClick={() => window.open(m.secureUrl, "_blank")}>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button variant="destructive" size="icon" className="w-7 h-7" onClick={() => handleDelete(m.publicId)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-[10px] text-white font-mono truncate bg-black/50 p-1 rounded backdrop-blur-sm">
                  {(m.bytes / 1024).toFixed(1)} KB<br />
                  {m.width}x{m.height}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
