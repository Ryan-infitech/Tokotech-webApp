"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/ui/Pagination";
import FilterSidebar from "@/components/products/FilterSidebar";
import SortSelector from "@/components/products/SortSelector";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import SearchBar from "@/components/ui/SearchBar";
import { productApi } from "@/lib/api";
import {
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Define types for products and brands
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price?: number | null;
  image_url?: string;
  brand?: string;
  // Add other product properties as needed
}

interface Brand {
  id: string;
  name: string;
}

interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

function ProductListSkeleton() {
  return (
    <div className="container-custom py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-6"></div>
        <div className="flex flex-wrap gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
              <div className="h-64 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Komponen client yang menggunakan useSearchParams
function ProductList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0,
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get query parameters
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const price = searchParams.get("price");
  const sort = searchParams.get("sort") || "newest";
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const is_featured = searchParams.get("is_featured");

  // Check if there are active filters
  const hasActiveFilters = !!brand || !!price || !!category || !!q;

  // Handle clearing the search
  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  // Fetch products data
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = {
        page,
        limit: 12,
        sort,
        ...(category && { category }),
        ...(brand && { brand }),
        ...(price && { price }),
        ...(q && { q }),
        ...(is_featured && { is_featured }),
      };

      const response = await productApi.getAll(queryParams);

      if (response.success) {
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || {});
        setBrands(response.data.brands || []);
      } else {
        setError(response.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("An error occurred while fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, brand, price, sort, q, page, is_featured]);

  // Create page title based on filters
  const getPageTitle = () => {
    if (q) return `Search Results for "${q}"`;
    if (is_featured === "true") return "Featured Products";
    if (category) return `${category.replace(/-/g, " ")} Products`;
    return "All Products";
  };

  return (
    <div className="container-custom pt-16 pb-8 md:pt-20 md:pb-12">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{getPageTitle()}</h1>

        {/* Enhanced responsive search bar */}
        <div className="mt-4">
          <SearchBar
            initialQuery={q || ""}
            currentSearchParams={searchParams}
            placeholder="Find products by name, brand, or description..."
            autoFocus={!!q}
            containerClass="max-w-full md:max-w-2xl mx-auto"
          />

          {/* Enhanced search tips for better UX */}
          {q && (
            <div className="mt-2 text-sm text-gray-500 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span>Looking for:</span>
              <span className="px-2 py-1 bg-gray-100 rounded-full">{q}</span>
              <button
                onClick={clearSearch}
                className="text-primary hover:text-primary-dark underline text-sm flex items-center"
              >
                <XMarkIcon className="h-3 w-3 mr-1" />
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4 lg:pr-6">
          <div
            className={`lg:sticky lg:top-20 bg-white rounded-lg shadow-sm p-4`}
          >
            <FilterSidebar
              selectedBrand={brand}
              selectedPrice={price}
              brands={brands}
              isOpen={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Product Controls - Sort, View Toggle, Filter Toggle */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Left side - Mobile filter toggle and product count */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-1 lg:hidden px-3 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <FunnelIcon className="h-4 w-4" />
                  <span>
                    {hasActiveFilters ? "Filters (Active)" : "Filters"}
                  </span>
                </button>

                <p className="text-gray-600 text-sm">
                  {!isLoading &&
                    `Showing ${products.length} of ${pagination.totalItems} products`}
                </p>
              </div>

              {/* Right side - View toggle and sort */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* View toggle */}
                <div className="flex border rounded-md overflow-hidden">
                  <button
                    className={`p-2 ${
                      viewMode === "grid" ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-50 transition-colors`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button
                    className={`p-2 ${
                      viewMode === "list" ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-50 transition-colors`}
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <ListBulletIcon className="h-5 w-5" />
                  </button>
                </div>

                <SortSelector currentSort={sort} />
              </div>
            </div>

            {/* Active filters summary - show on mobile when filters are applied */}
            {hasActiveFilters && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                {category && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100">
                    Category: {category.replace(/-/g, " ")}
                  </span>
                )}
                {brand && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100">
                    Brand: {brands.find((b) => b.id === brand)?.name || brand}
                  </span>
                )}
                {price && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100">
                    Price Filter Active
                  </span>
                )}
                {q && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100">
                    Search: "{q}"
                    <button
                      onClick={clearSearch}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      aria-label="Clear search"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Products Grid or List */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            {/* Loading State */}
            {isLoading ? (
              <ProductGridSkeleton count={12} />
            ) : error ? (
              <ErrorDisplay
                title="Failed to Load Products"
                message={error}
                actionText="Try Again"
                actionFn={fetchProducts}
              />
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search terms to find what
                  you&apos;re looking for.
                </p>

                {/* Show search suggestions if search was used */}
                {q && (
                  <div className="max-w-md mx-auto">
                    <h4 className="font-medium mb-2">Search suggestions:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Check for spelling mistakes</li>
                      <li>• Use more general keywords</li>
                      <li>• Try searching for related products</li>
                    </ul>
                    <button
                      onClick={clearSearch}
                      className="mt-4 text-primary hover:text-primary-dark underline"
                    >
                      Clear search and show all products
                    </button>
                  </div>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    listView={true}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !error && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={() => {
                    window.scrollTo(0, 0);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList />
    </Suspense>
  );
}
