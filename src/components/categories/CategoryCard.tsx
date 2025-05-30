"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  productCount?: number | { count: number } | null;
  isLarge?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  slug,
  imageUrl,
  productCount = 0, // Default to 0 if not provided
  isLarge = false,
}) => {
  // Use a consistent fallback image
  const fallbackImage = "/images/placeholder/category.jpg";

  // Safely display product count, handling objects and null values
  const getProductCount = () => {
    if (typeof productCount === "number") {
      return productCount;
    } else if (
      productCount &&
      typeof productCount === "object" &&
      "count" in productCount
    ) {
      return (productCount as { count: number }).count || 0;
    }
    return 0;
  };

  const displayCount = getProductCount();

  return (
    <Link href={`/categories/${slug}`}>
      <div
        className={`relative rounded-lg overflow-hidden group ${
          isLarge ? "aspect-[3/2]" : "aspect-[4/3]"
        }`}
      >
        {/* Image */}
        <div className="absolute inset-0 bg-gray-200">
          <Image
            src={imageUrl || fallbackImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes={
              isLarge
                ? "(max-width: 768px) 100vw, 33vw"
                : "(max-width: 768px) 50vw, 16vw"
            }
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
        </div>

        {/* Category info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3
            className={`font-medium ${
              isLarge ? "text-lg" : "text-base"
            } line-clamp-1`}
          >
            {name}
          </h3>
          <p className="text-xs text-white/80 mt-0.5">
            {displayCount} products
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
