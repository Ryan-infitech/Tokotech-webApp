"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  useCartStore,
  calculateCartSubtotal,
  calculateTotalItems,
} from "@/store/cartStore"; // Now properly importing these functions
import { useAuthStore } from "@/hooks/useAuth";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Button from "@/components/ui/Button";
import {
  ShoppingBagIcon,
  LockClosedIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function CartPage() {
  const {
    items,
    loading: isLoading,
    error,
    fetchCart,
    initialized,
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();
  const [clientReady, setClientReady] = useState(false);

  // Initialize cart on client-side
  useEffect(() => {
    setClientReady(true);

    if (!initialized) {
      console.log("Cart page: Initializing cart data");
      fetchCart().then(() => {
        validateCartData();
      });
    } else {
      validateCartData();
    }
  }, [fetchCart, initialized]);

  // Validate cart data to ensure prices are correct
  const validateCartData = () => {
    const { items } = useCartStore.getState();

    if (items.length === 0) return;

    // Calculate totals directly using the exported functions
    const subtotal = calculateCartSubtotal(items);
    const count = calculateTotalItems(items);

    console.log(
      `Cart validation: ${items.length} items, subtotal=${subtotal}, count=${count}`
    );

    // Only show error if there's a severe issue
    if (items.length > 0 && (isNaN(subtotal) || subtotal < 0)) {
      console.error("Invalid cart data: Items exist but subtotal is invalid");
      console.log("Attempting to reload cart data...");
      fetchCart();
    }
  };

  // Explicitly refresh cart data
  const handleRefresh = () => {
    fetchCart().then(() => {
      validateCartData();
    });
  };

  if (!clientReady) {
    return (
      <div className="container-custom py-16 min-h-[50vh] flex items-center justify-center mt-16">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show login prompt for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="container-custom py-16 min-h-[50vh] mt-16">
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
            <LockClosedIcon className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Silakan Masuk untuk Melihat Keranjang Anda
          </h1>
          <p className="text-gray-500 mb-6">
            Anda perlu login untuk menambahkan barang ke keranjang dan checkout
          </p>
          <Link href="/login?redirect=/cart">
            <Button>Masuk</Button>
          </Link>
          <div className="mt-4">
            <Link href="/products" className="text-accent hover:underline">
              Lanjutkan Belanja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-custom py-16 min-h-[50vh] mt-16">
        <h1 className="text-3xl font-bold mb-6">Keranjang Belanja Anda</h1>
        <div className="animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="py-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-40 h-40 bg-gray-200 rounded-lg mb-4 sm:mb-0"></div>
                <div className="flex-1 sm:ml-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/5"></div>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-8">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-16 min-h-[50vh] mt-16">
        <div className="bg-red-50 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-red-700 mb-2">Error</h1>
          <p className="mb-4 text-red-600">{error}</p>
          <Button onClick={() => fetchCart()}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-16 min-h-[50vh] mt-16">
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
            <ShoppingBagIcon className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Keranjang Anda Kosong</h1>
          <p className="text-gray-500 mb-6">
            Sepertinya Anda belum menambahkan produk apa pun ke keranjang.
          </p>
          <Link href="/products">
            <Button>Mulai Berbelanja</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 md:py-16 pt-16 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Keranjang Belanja Anda
        </h1>
        <button
          onClick={handleRefresh}
          className="flex items-center text-sm text-gray-600 hover:text-accent"
          aria-label="Refresh cart"
        >
          <ArrowPathIcon className="h-5 w-5 mr-1" />
          Segarkan
        </button>
      </div>

      <div className="md:grid md:grid-cols-3 md:gap-8">
        {/* Cart Items - Takes up 2/3 of the grid on desktop */}
        <div className="md:col-span-2 mb-8 md:mb-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Cart Items List */}
            <div>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary - Takes up 1/3 of the grid on desktop */}
        <div className="md:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
