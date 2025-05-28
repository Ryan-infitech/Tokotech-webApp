"use client";

import React, { useState, useEffect } from "react";
import { categoryApi } from "@/lib/api/categoryApi"; // Use dedicated API
import CategoryCard from "@/components/categories/CategoryCard";
import { CategoryGridSkeleton } from "@/components/ui/Skeleton";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

// Define the Category interface
interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  category_parent_id?: string;
  parent_id?: string;
  product_count?: number | { count: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        setError(null);

        // Use the dedicated categoryApi for consistent handling
        const response = await categoryApi.getAll();

        if (response.success) {
          console.log("Categories fetched:", response.data.length);
          setCategories(response.data || []);
        } else {
          console.error("Failed to fetch categories:", response);
          setError(response.message || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("An error occurred while fetching categories");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Helper function to normalize product count
  const normalizeProductCount = (
    productCount?: number | { count: number }
  ): number | undefined => {
    if (typeof productCount === "number") {
      return productCount;
    } else if (
      productCount &&
      typeof productCount === "object" &&
      "count" in productCount
    ) {
      return productCount.count;
    }
    return undefined;
  };

  if (isLoading) {
    return (
      <div className="container-custom pt-24 pb-8 md:pt-28 md:pb-12">
        <h1 className="text-3xl font-bold text-center mb-10">Categories</h1>
        <CategoryGridSkeleton count={12} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom pt-24 pb-8 md:pt-28 md:pb-12">
        <ErrorDisplay
          title="Failed to Load Categories"
          message={error}
          actionText="Try Again"
          actionFn={() => window.location.reload()}
        />
      </div>
    );
  }

  // Group categories by parent - handle both field name formats
  const parentCategories = categories.filter(
    (cat) => !cat.category_parent_id && !cat.parent_id
  );
  console.log("Found parent categories:", parentCategories.length);

  // Function to get child categories for a parent
  const getChildCategories = (parentId: string) => {
    return categories.filter(
      (cat) => cat.category_parent_id === parentId || cat.parent_id === parentId
    );
  };

  return (
    <div className="container-custom pt-24 pb-8 md:pt-28 md:pb-12">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">All Categories</h1>
      </div>

      {/* Main Categories */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Main Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {parentCategories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              slug={category.slug}
              imageUrl={
                category.image_url || `/images/categories/${category.slug}.jpg`
              }
              productCount={normalizeProductCount(category.product_count)}
              isLarge={true}
            />
          ))}
        </div>
      </div>

      {/* Parent Category Sections with Children */}
      {parentCategories.map((parent) => {
        const children = getChildCategories(parent.id);
        if (children.length === 0) return null;

        return (
          <div key={parent.id} className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">{parent.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {children.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  slug={category.slug}
                  imageUrl={
                    category.image_url ||
                    `/images/categories/${category.slug}.jpg`
                  }
                  productCount={normalizeProductCount(category.product_count)}
                  isLarge={false}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
