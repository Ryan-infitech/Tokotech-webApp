"use client";

import React from "react";
import AccountLayout from "@/components/account/AccountLayout";
import WishlistSection from "@/components/account/WishlistSection";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { fetchWishlist } = useWishlist();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/account/wishlist");
    } else if (isAuthenticated) {
      // Explicitly refresh wishlist data when page loads
      fetchWishlist();
    }
  }, [isAuthenticated, isLoading, router, fetchWishlist]);

  if (isLoading) {
    return (
      <div className="container-custom py-10 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <AccountLayout>
      <WishlistSection />
    </AccountLayout>
  );
}
