"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  brand?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  maxQuantity: number;
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  totalPages?: number;
  currentPage?: number;
}

export default function ProductGrid({
  products = [],
  isLoading = false,
  totalPages = 1,
  currentPage = 1,
}: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCartStore(); // Get addItem from cartStore

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  const handleAddToCart = async (product: Product) => {
    // Pass the correct arguments to addItem (productId and quantity)
    await addItem(product.id, 1);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (safeProducts.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {safeProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              sale_price: product.salePrice,
              image_url: product.imageUrl,
              brand: product.brand,
              rating: product.rating,
              review_count: product.reviewCount,
            }}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <div className="flex space-x-1">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "primary" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
