"use client";

import React, { useState, useEffect } from "react";
import { promotionApi } from "@/lib/api/promotionApi";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatters";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  image_url: string;
}

interface Promotion {
  id: string;
  title: string;
  description?: string;
  banner_image?: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  start_date: string;
  end_date: string;
  status: "active" | "upcoming" | "expired";
  is_featured: boolean;
  products: Product[];
}

export default function DealsPage() {
  const [activePromos, setActivePromos] = useState<Promotion[]>([]);
  const [upcomingPromos, setUpcomingPromos] = useState<Promotion[]>([]);
  const [expandedPromo, setExpandedPromo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromos = async () => {
      setIsLoading(true);
      try {
        const response = await promotionApi.getActivePromotions();

        if (response.success) {
          const activePromotions = response.data
            .filter((promo: Promotion) => promo.status === "active")
            .sort((a: Promotion, b: Promotion) => (b.is_featured ? 1 : -1));

          const upcomingPromotions = response.data
            .filter((promo: Promotion) => promo.status === "upcoming")
            .sort((a: Promotion, b: Promotion) => {
              return (
                new Date(a.start_date).getTime() -
                new Date(b.start_date).getTime()
              );
            });

          setActivePromos(activePromotions);
          setUpcomingPromos(upcomingPromotions);

          // Auto-expand featured promotion if any
          const featured = activePromotions.find(
            (p: Promotion) => p.is_featured
          );
          if (featured && activePromotions.length > 0) {
            setExpandedPromo(featured.id);
          } else if (activePromotions.length > 0) {
            setExpandedPromo(activePromotions[0].id);
          }
        } else {
          setError("Failed to load promotions");
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setError("An error occurred while loading promotions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const toggleExpandPromo = (promoId: string) => {
    setExpandedPromo(expandedPromo === promoId ? null : promoId);
  };

  // Helper function to calculate discounted price
  const calculateDiscountedPrice = (price: number, promo: Promotion) => {
    if (promo.discount_type === "percentage") {
      return price - price * (promo.discount_value / 100);
    } else {
      return Math.max(0, price - promo.discount_value);
    }
  };

  // Helper function to format discount text
  const formatDiscount = (promo: Promotion) => {
    if (promo.discount_type === "percentage") {
      return `${promo.discount_value}%`;
    } else {
      return formatPrice(promo.discount_value);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Deals & Promotions
        </h1>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
          <div className="h-48 bg-gray-200 rounded-xl mb-8"></div>
          <div className="h-48 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Deals & Promotions
        </h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
          <button
            className="mt-2 text-sm font-medium underline"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (activePromos.length === 0 && upcomingPromos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Deals & Promotions
        </h1>
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">
            No Promotions Available
          </h2>
          <p className="text-gray-500">Check back later for exciting deals!</p>
          <Link
            href="/products"
            className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 pt-16 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Deals & Promotions</h1>
        {/* <Link
          href="/"
          className="text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          View All
        </Link> */}
      </div>

      {/* Active Promotions Section */}
      {activePromos.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Active Deals</h2>
          <div className="space-y-6">
            {activePromos.map((promo) => (
              <div
                key={promo.id}
                className="bg-white rounded-xl overflow-hidden shadow-md"
              >
                {/* Banner Image */}
                <div
                  className="cursor-pointer relative"
                  onClick={() => toggleExpandPromo(promo.id)}
                >
                  {promo.banner_image ? (
                    <div className="aspect-[21/9] relative">
                      <Image
                        src={promo.banner_image}
                        alt={promo.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1200px"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[21/9] bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <h3 className="text-2xl md:text-3xl font-bold text-white px-6 py-12 text-center">
                        {promo.title}
                      </h3>
                    </div>
                  )}

                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Save {formatDiscount(promo)}
                  </div>

                  {/* Clickable Indicator */}
                  <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-full p-2">
                    {expandedPromo === promo.id ? (
                      <ChevronDownIcon className="h-6 w-6 text-gray-700" />
                    ) : (
                      <ChevronRightIcon className="h-6 w-6 text-gray-700" />
                    )}
                  </div>
                </div>

                {/* Promo Info Header */}
                <div className="p-4 bg-white">
                  <h3 className="text-lg md:text-xl font-semibold">
                    {promo.title}
                  </h3>
                  {promo.description && (
                    <p className="text-gray-600 mt-1 text-sm">
                      {promo.description}
                    </p>
                  )}
                </div>

                {/* Expanded Products - UPDATED GRID FOR MOBILE */}
                {expandedPromo === promo.id &&
                  promo.products &&
                  promo.products.length > 0 && (
                    <div className="p-2 sm:p-4 bg-gray-50 border-t">
                      <h4 className="font-medium mb-3 px-2">
                        Products in this promotion:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                        {promo.products.map((product) => (
                          <div
                            key={product.id}
                            className="bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
                          >
                            {/* Product Image */}
                            <Link href={`/products/${product.slug}`}>
                              <div className="aspect-square relative">
                                <Image
                                  src={
                                    product.image_url ||
                                    "/images/placeholder.png"
                                  }
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                />
                              </div>
                            </Link>

                            {/* Product Info - Simplified for mobile */}
                            <div className="p-2 sm:p-3">
                              <Link
                                href={`/products/${product.slug}`}
                                className="hover:text-accent"
                              >
                                <h5 className="font-medium text-sm sm:text-base line-clamp-2 mb-1 min-h-[2.5rem]">
                                  {product.name}
                                </h5>
                              </Link>
                              <div className="flex flex-col sm:flex-row sm:items-center mt-1 sm:mt-2">
                                <span className="text-accent font-semibold text-sm sm:text-base">
                                  {formatPrice(
                                    calculateDiscountedPrice(
                                      product.price,
                                      promo
                                    )
                                  )}
                                </span>
                                <span className="text-gray-400 line-through text-xs sm:text-sm sm:ml-2">
                                  {formatPrice(product.price)}
                                </span>
                              </div>

                              {/* Add to Cart Button */}
                              <div className="mt-2">
                                <AddToCartButton
                                  product={product}
                                  quantity={1}
                                  buttonSize="sm"
                                  fullWidth
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {promo.products.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          No products available in this promotion
                        </p>
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Promotions Section */}
      {upcomingPromos.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Upcoming Deals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingPromos.map((promo) => {
              const startDate = new Date(promo.start_date);
              const formattedDate = startDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={promo.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100"
                >
                  {/* Banner Image or Placeholder */}
                  {promo.banner_image ? (
                    <div className="aspect-[16/9] relative">
                      <Image
                        src={promo.banner_image}
                        alt={promo.title}
                        fill
                        className="object-cover opacity-80"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="text-white text-center px-4">
                          <p className="text-sm font-medium mb-1">
                            Coming Soon
                          </p>
                          <p className="text-lg font-bold">{formattedDate}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
                      <div className="text-center px-4">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Coming Soon
                        </p>
                        <p className="text-lg font-bold">{formattedDate}</p>
                      </div>
                    </div>
                  )}

                  {/* Promo Info */}
                  <div className="p-4">
                    <h3 className="font-semibold">{promo.title}</h3>
                    {promo.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {promo.description}
                      </p>
                    )}

                    {/* Discount Badge */}
                    <div className="mt-3 inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      Will save you {formatDiscount(promo)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
