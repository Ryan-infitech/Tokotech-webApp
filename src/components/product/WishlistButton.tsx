import React, { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useWishlist } from "@/hooks/useWishlist";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  className = "",
}) => {
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, addToWishlist, removeFromWishlist, wishlistItems } =
    useWishlist();
  const [isInList, setIsInList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if product is in wishlist when component mounts or wishlist items change
  useEffect(() => {
    setIsInList(isInWishlist(productId));
  }, [productId, isInWishlist, wishlistItems]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(
        "/login?redirect=" + encodeURIComponent(window.location.pathname)
      );
      return;
    }

    setIsLoading(true);
    try {
      if (isInList) {
        await removeFromWishlist(productId);
        setIsInList(false);
      } else {
        await addToWishlist(productId);
        setIsInList(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      aria-label={isInList ? "Hapus dari favorit" : "Tambah ke favorit"}
      className={`rounded-full p-2 ${
        isInList
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-gray-50 hover:bg-gray-100"
      } transition-colors ${className}`}
    >
      {isInList ? (
        <HeartSolidIcon className="w-5 h-5 text-red-500" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default WishlistButton;
