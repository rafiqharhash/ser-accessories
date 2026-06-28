"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Hover Zoom Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const nextImage = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
      {/* Thumbnails (Vertical on desktop, horizontal on mobile) */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide md:w-24 flex-shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "relative w-20 h-24 md:w-full md:h-32 flex-shrink-0 border-2 transition-all",
              currentIndex === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div 
        className="relative w-full aspect-[3/4] md:aspect-auto md:h-[700px] bg-muted overflow-hidden group cursor-zoom-in"
        ref={imageRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={images[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                transform: isHovering ? "scale(2)" : "scale(1)",
                transition: isHovering ? "none" : "transform 0.3s ease-out",
              }}
            />
          </motion.div>
        </AnimatePresence>

        <button 
          className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Open fullscreen"
        >
          <Maximize2 size={20} className="text-black" />
        </button>

        {/* Mobile Swipe Indicators / Arrows (Desktop) */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="p-2 bg-white/80 backdrop-blur rounded-full pointer-events-auto text-black hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="p-2 bg-white/80 backdrop-blur rounded-full pointer-events-auto text-black hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white z-50"
              aria-label="Close fullscreen"
            >
              <X size={32} />
            </button>
            
            <button onClick={prevImage} className="absolute left-6 p-4 text-white/70 hover:text-white z-50" aria-label="Previous">
              <ChevronLeft size={48} />
            </button>

            <div className="relative w-full max-w-5xl h-[80vh]">
              <Image
                src={images[currentIndex]}
                alt={`${productName} fullscreen`}
                fill
                className="object-contain"
                sizes="100vw"
                quality={100}
              />
            </div>

            <button onClick={nextImage} className="absolute right-6 p-4 text-white/70 hover:text-white z-50" aria-label="Next">
              <ChevronRight size={48} />
            </button>
            
            {/* Lightbox Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 tracking-widest text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
