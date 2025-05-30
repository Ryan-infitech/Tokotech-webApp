import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface ProductImage {
  id: string;
  image_url: string;
  alt_text?: string;
  is_primary?: boolean;
  display_order?: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[] | null | undefined;
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Ensure images is an array, even if null/undefined is passed
  const safeImages = Array.isArray(images) ? images : [];

  // Find primary image index or default to 0
  useEffect(() => {
    if (safeImages.length > 0) {
      const primaryIndex = safeImages.findIndex((img) => img.is_primary);
      if (primaryIndex >= 0) {
        setActiveImageIndex(primaryIndex);
      }
    }
  }, [safeImages]);

  // Handle next/previous navigation
  const goToNextImage = () => {
    if (safeImages.length === 0) return;
    setActiveImageIndex((prev) => (prev + 1) % safeImages.length);
  };

  const goToPrevImage = () => {
    if (safeImages.length === 0) return;
    setActiveImageIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  // If no images are available, show a placeholder
  if (safeImages.length === 0) {
    return (
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          No image available
        </div>
      </div>
    );
  }

  // Make sure activeImageIndex is valid
  const safeActiveIndex = activeImageIndex < safeImages.length ? activeImageIndex : 0;

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
        <Image
          src={safeImages[safeActiveIndex]?.image_url || "/images/placeholder.png"}
          alt={safeImages[safeActiveIndex]?.alt_text || productName}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Image navigation arrows (only show if there are multiple images) */}
        {safeImages.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-sm hover:bg-white focus:outline-none"
              onClick={goToPrevImage}
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-sm hover:bg-white focus:outline-none"
              onClick={goToNextImage}
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {safeImages.map((image, index) => (
            <button
              key={image.id || index}
              className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                index === safeActiveIndex
                  ? "border-accent"
                  : "border-transparent"
              }`}
              onClick={() => setActiveImageIndex(index)}
            >
              <Image
                src={image.image_url || "/images/placeholder.png"}
                alt={
                  image.alt_text || `${productName} - thumbnail ${index + 1}`
                }
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
