"use client";

import React, { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/products/ProductCard";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price?: number | null;
  image_url?: string;
  stock_quantity: number;
  brand?: string;
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  is_featured?: boolean;
  [key: string]: any;
}

interface InfiniteProductListProps {
  initialProducts: Product[];
  fetchProducts: (page: number) => Promise<{
    success: boolean;
    data: { products: Product[]; total?: number };
    message?: string;
  }>;
  columns?: { sm?: number; md?: number; lg?: number };
  emptyMessage?: string;
  perPage?: number;
  className?: string;
  initialLoading?: boolean;
}

const InfiniteProductList: React.FC<InfiniteProductListProps> = ({
  initialProducts,
  fetchProducts,
  columns = { sm: 2, lg: 4 },
  emptyMessage = "No products available",
  perPage = 8,
  className = "",
  initialLoading = false,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [hasMore, setHasMore] = useState(initialProducts?.length >= perPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [allLoaded, setAllLoaded] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(initialLoading);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const productIdsRef = useRef<Set<string>>(new Set());

  // Initialize the set of product IDs from initialProducts
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      const idSet = new Set(initialProducts.map((p) => p.id));
      productIdsRef.current = idSet;
      console.log(`Initial product set has ${idSet.size} unique products`);
    }
  }, [initialProducts]);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setHasMore(initialProducts.length >= perPage);
      setIsInitialLoading(false);
    }
  }, [initialProducts, perPage]);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    if (isInitialLoading || !hasMore) return; // Don't observe while initial loading or no more products

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const loaderElement = loaderRef.current;
    if (loaderElement) observer.observe(loaderElement);

    return () => {
      if (loaderElement) observer.unobserve(loaderElement);
    };
  }, [hasMore, loading, isInitialLoading]);

  // Function to load more items with duplicate prevention
  const loadMore = async () => {
    if (loading || !hasMore) return;

    // If we already have all products, don't fetch more
    if (totalProducts !== null && products.length >= totalProducts) {
      setHasMore(false);
      setAllLoaded(true);
      console.log(
        `All ${totalProducts} products loaded, stopping further requests`
      );
      return;
    }

    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      console.log(`Loading more products - page ${nextPage}`);

      const response = await fetchProducts(nextPage);

      if (response.success && response.data?.products) {
        const newProducts = response.data.products;

        // Update total count if available
        if (response.data.total !== undefined) {
          setTotalProducts(response.data.total);
          console.log(`Total available products: ${response.data.total}`);
        }

        if (newProducts.length === 0) {
          setHasMore(false);
          setAllLoaded(true);
          console.log("No more products to load");
          return;
        }

        // Filter out duplicates
        const uniqueNewProducts = newProducts.filter((product) => {
          if (productIdsRef.current.has(product.id)) {
            console.log(`Skipping duplicate product: ${product.id}`);
            return false;
          }
          productIdsRef.current.add(product.id);
          return true;
        });

        console.log(
          `Loaded ${uniqueNewProducts.length} new unique products (filtered from ${newProducts.length})`
        );

        if (uniqueNewProducts.length > 0) {
          setProducts((prev) => [...prev, ...uniqueNewProducts]);
          setCurrentPage(nextPage);
        }

        // If we got less unique products than expected or we've reached the total, we're done
        const reachedEnd =
          uniqueNewProducts.length < newProducts.length ||
          (totalProducts !== null &&
            products.length + uniqueNewProducts.length >= totalProducts);

        setHasMore(!reachedEnd);
        setAllLoaded(reachedEnd);

        if (reachedEnd) {
          console.log("All available products have been loaded");
        }
      } else {
        console.error("Error loading more products:", response.message);
        setError(response.message || "Failed to load more products");
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
      setError("Error loading more products. Please try again.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to retry after error
  const handleRetry = () => {
    setError(null);
    setHasMore(true);
    loadMore();
  };

  // Initial data loading if no initialProducts provided
  useEffect(() => {
    const loadInitialData = async () => {
      if (
        initialLoading &&
        (!initialProducts || initialProducts.length === 0)
      ) {
        try {
          console.log("Loading initial products data");
          const response = await fetchProducts(1);
          console.log("Initial data response:", response);

          if (response.success && response.data?.products) {
            setProducts(response.data.products);
            setHasMore(response.data.products.length >= perPage);

            // Store product IDs to prevent duplicates
            const idSet = new Set(response.data.products.map((p) => p.id));
            productIdsRef.current = idSet;

            // Store total count if available
            if (response.data.total !== undefined) {
              setTotalProducts(response.data.total);
            }

            if (response.data.products.length === 0) {
              setAllLoaded(true);
            }
          } else {
            setError(response.message || "Failed to load products");
          }
        } catch (error) {
          console.error("Error loading initial products:", error);
          setError("Error loading products. Please try again.");
        } finally {
          setIsInitialLoading(false);
        }
      }
    };

    loadInitialData();
  }, []);

  // Get CSS classes for grid columns
  const getGridColsClasses = () => {
    return `grid-cols-${columns.sm} md:grid-cols-${
      columns.md || columns.sm
    } lg:grid-cols-${columns.lg}`;
  };

  if (isInitialLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  return (
    <div className={className}>
      {products.length > 0 ? (
        <div className={`grid gap-4 sm:gap-6 ${getGridColsClasses()}`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
          <p className="mb-2">{error}</p>
          <button
            onClick={handleRetry}
            className="text-accent hover:underline font-medium"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}

      {/* Loading, error, and "load more" states */}
      <div className="mt-8 text-center" ref={loaderRef}>
        {loading && (
          <div className="flex items-center justify-center">
            <ArrowPathIcon className="h-6 w-6 animate-spin text-accent mr-2" />
            <span className="text-gray-600">Loading more products...</span>
          </div>
        )}

        {error && !products.length && (
          <div className="text-red-600 py-4">
            <p>{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 text-accent hover:underline font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {allLoaded && products.length > 0 && (
          <p className="text-gray-500 py-4">All products loaded</p>
        )}
      </div>
    </div>
  );
};

export default InfiniteProductList;
