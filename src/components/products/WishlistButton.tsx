import React, { useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useWishlist } from "@/hooks/useWishlist";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface WishlistButtonProps {
  productId: string;
  variant?: "icon" | "button" | "icon-label";
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  variant = "icon",
  className = "",
}) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const inWishlist = isInWishlist(productId);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing) return;

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    setIsProcessing(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleToggleWishlist}
        className={`p-2 rounded-full focus:outline-none ${
          inWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"
        } ${className}`}
        disabled={isProcessing}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {inWishlist ? (
          <HeartSolid className="w-5 h-5" />
        ) : (
          <HeartOutline className="w-5 h-5" />
        )}
      </button>
    );
  }

  if (variant === "icon-label") {
    return (
      <button
        onClick={handleToggleWishlist}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md border ${
          inWishlist
            ? "border-red-200 bg-red-50 text-red-600"
            : "border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        } transition-colors ${className}`}
        disabled={isProcessing}
      >
        {inWishlist ? (
          <>
            <HeartSolid className="w-4 h-4" />
            <span className="text-sm">Saved</span>
          </>
        ) : (
          <>
            <HeartOutline className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </>
        )}
      </button>
    );
  }

  // Button variant
  return (
    <button
      onClick={handleToggleWishlist}
      className={`px-4 py-2 rounded-md border ${
        inWishlist
          ? "bg-red-50 border-red-200 text-red-600"
          : "border-gray-300 hover:bg-gray-50"
      } transition-colors flex items-center justify-center gap-2 ${className}`}
      disabled={isProcessing}
    >
      {inWishlist ? (
        <>
          <HeartSolid className="w-5 h-5" />
          <span>Saved to Wishlist</span>
        </>
      ) : (
        <>
          <HeartOutline className="w-5 h-5" />
          <span>Add to Wishlist</span>
        </>
      )}
    </button>
  );
};

export default WishlistButton;
