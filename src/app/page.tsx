"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CategoryCard from "@/components/categories/CategoryCard";
import Button from "@/components/ui/Button";
import { categoryApi } from "@/lib/api";
import { CategoryGridSkeleton } from "@/components/ui/Skeleton";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import InfiniteProductList from "@/components/products/InfiniteProductList";
import { productApi } from "@/lib/api/productApi";

// Define interfaces for type safety
interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  product_count?: number | { count: number };
}

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
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setCategoriesError(null);
      const response = await categoryApi.getAll();

      if (response.success) {
        setCategories(response.data || []);
      } else {
        console.error("Error from API:", response);
        setCategoriesError(response.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoriesError("An error occurred while fetching categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Helper function to normalize product count
  const normalizeProductCount = (
    productCount?: number | { count: number }
  ): number => {
    if (typeof productCount === "number") {
      return productCount;
    } else if (
      productCount &&
      typeof productCount === "object" &&
      "count" in productCount
    ) {
      return productCount.count;
    }
    return 0;
  };

  // Product fetching functions - only needed once to get initial data
  const fetchInitialFeaturedProducts = async () => {
    try {
      const response = await productApi.getFeatured(8);
      if (response.success) {
        setFeaturedProducts(response.data.products || []);
      }
      return response;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return {
        success: false,
        message: "Failed to fetch featured products",
        data: { products: [] },
      };
    }
  };

  // Function to fetch featured products with page parameter
  const fetchFeaturedProducts = async (page = 1) => {
    try {
      console.log(`Fetching featured products page ${page}`);
      const response = await productApi.getFeatured(8, page);
      return response;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return {
        success: false,
        message: "Failed to fetch featured products",
        data: { products: [] },
      };
    }
  };

  // Function to fetch latest products with page parameter
  const fetchLatestProducts = async (page = 1) => {
    try {
      console.log(`Fetching latest products page ${page}`);
      const response = await productApi.getLatest(8, page);
      console.log("Latest products response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching latest products:", error);
      return {
        success: false,
        message: "Failed to fetch latest products",
        data: { products: [] },
      };
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCategories();
    fetchInitialFeaturedProducts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          marginTop: "-64px",
          backgroundImage: "url('/images/hero-banner.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-indigo-400/70"></div>

        <div className="container-custom h-full flex flex-col justify-center pt-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Masa Depan Teknologi Ada di Sini
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Temukan gadget dan aksesori terbaru dengan penawaran luar biasa
                dan kualitas premium.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors">
                    Belanja Sekarang
                  </button>
                </Link>
                <Link href="/about">
                  <button className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-md font-medium transition-colors">
                    Pelajari Lebih Lanjut
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-padding bg-light-gray">
        <div className="container-custom">
          <h2 className="section-title text-center mb-8">Kategori Produk</h2>

          {isLoadingCategories ? (
            <CategoryGridSkeleton count={6} />
          ) : categoriesError ? (
            <ErrorDisplay
              title="Gagal Memuat Kategori"
              message={categoriesError}
              actionText="Coba Lagi"
              actionFn={() => fetchCategories()}
            />
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-500">
              Tidak ada kategori tersedia
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {categories.slice(0, 6).map((category) => (
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
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Produk Unggulan</h2>
            <Link
              href="/products?is_featured=true"
              className="text-accent hover:underline font-medium"
            >
              Lihat Semua
            </Link>
          </div>

          <InfiniteProductList
            initialProducts={featuredProducts}
            fetchProducts={fetchFeaturedProducts}
            columns={{ sm: 2, lg: 4 }}
            emptyMessage="Tidak ada produk unggulan tersedia"
            className="mb-6"
            initialLoading={featuredProducts.length === 0}
          />
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-accent">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-4">
                Hemat Besar di Promo Musim Panas
              </h2>
              <p className="text-lg mb-6">
                Diskon hingga 40% untuk produk pilihan. Penawaran terbatas.
              </p>
              <Link href="/products?on_sale=true">
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                >
                  Temukan Promo
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <Image
                src="/images/promo-banner.jpg"
                alt="Promo Musim Panas"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Produk Terbaru</h2>
            <Link
              href="/products?sort=newest"
              className="text-accent hover:underline font-medium"
            >
              Lihat Semua
            </Link>
          </div>

          <InfiniteProductList
            initialProducts={[]}
            fetchProducts={fetchLatestProducts}
            columns={{ sm: 2, lg: 4 }}
            emptyMessage="Tidak ada produk terbaru tersedia"
            className="mb-6"
            initialLoading={true}
          />
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-light-gray">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Dapatkan Info Terbaru</h2>
          <p className="text-lg text-gray-600 mb-8">
            Berlangganan newsletter kami untuk mendapatkan penawaran eksklusif,
            produk terbaru, dan tips teknologi.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Alamat email Anda"
              className="input-field flex-grow"
            />
            <Button variant="primary" className="whitespace-nowrap">
              Berlangganan
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
