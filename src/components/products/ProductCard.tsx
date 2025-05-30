import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price?: number | null;
  image_url?: string;
  imageUrl?: string;
  brand?: string | null;
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  is_featured?: boolean;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  listView?: boolean;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  listView = false,
  onAddToCart,
}) => {
  const router = useRouter();

  // Handle undefined product
  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
        <div className="text-gray-400 text-center">Product not available</div>
      </div>
    );
  }

  const {
    name,
    slug,
    price,
    sale_price,
    image_url,
    imageUrl,
    brand,
    rating,
    review_count,
    is_new,
    is_featured,
    description,
  } = product;

  // Use image_url (DB field) or imageUrl (compatibility) or fallback
  const displayImage =
    image_url || imageUrl || "/images/product-placeholder.png";

  // Determine price display logic
  const displayPrice =
    sale_price !== null && sale_price !== undefined ? sale_price : price;

  const hasDiscount =
    sale_price !== null && sale_price !== undefined && sale_price < price;
  const discountPercentage = hasDiscount
    ? Math.round(((price - sale_price) / price) * 100)
    : 0;

  // Format rating to half-star precision (e.g., 4.5)
  const formattedRating = rating ? Math.round(rating * 2) / 2 : 0;

  // Prevent event propagation for button clicks
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  // Handle quick view button click
  const handleQuickView = () => {
    router.push(`/products/${slug}`);
  };

  // Handle add to cart button click
  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart();
  };

  // For list view: truncate description to a reasonable length
  const truncateDescription = (text?: string, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Grid View Card
  if (!listView) {
    return (
      <Link href={`/products/${slug}`} className="group">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
          {/* Product Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={displayImage}
              alt={name || "Product image"}
              width={300}
              height={300}
              className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
              priority={false}
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {hasDiscount && (
                <div className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                  {discountPercentage}% OFF
                </div>
              )}
              {is_new && !hasDiscount && (
                <div className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </div>
              )}
              {is_featured && !is_new && !hasDiscount && (
                <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                  FEATURED
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-4 flex flex-col flex-grow">
            {brand && <p className="text-xs text-gray-500 mb-1">{brand}</p>}

            {/* Product Name with fixed height */}
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
              {name}
            </h3>

            {/* Price */}
            <div className="mt-auto">
              {hasDiscount ? (
                <div className="space-y-1">
                  <div className="font-bold text-accent">
                    {formatCurrency(displayPrice)}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    {formatCurrency(price)}
                  </div>
                </div>
              ) : (
                <div className="font-bold text-gray-900">
                  {formatCurrency(displayPrice)}
                </div>
              )}
            </div>

            {/* Rating */}
            {rating !== undefined && (
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const diff = formattedRating - star;
                    return (
                      <span key={star} className="text-yellow-400">
                        {diff >= 0 ? (
                          // Full star
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : diff >= -0.5 ? (
                          // Half star
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          // Empty star
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4 text-gray-300"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        )}
                      </span>
                    );
                  })}
                </div>
                {review_count !== undefined && (
                  <span className="ml-1 text-xs text-gray-500">
                    ({review_count})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // List View Card
  return (
    <Link href={`/products/${slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full">
        <div className="flex flex-col sm:flex-row">
          {/* Product Image (Left Side) */}
          <div className="relative w-full sm:w-1/3 md:w-1/4 aspect-square sm:aspect-auto">
            <Image
              src={displayImage}
              alt={name || "Product image"}
              fill
              className="object-cover"
              priority={false}
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {hasDiscount && (
                <div className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                  {discountPercentage}% OFF
                </div>
              )}
              {is_new && !hasDiscount && (
                <div className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </div>
              )}
            </div>
          </div>

          {/* Product Details (Right Side) */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Brand & Name */}
            <div className="mb-2">
              {brand && <p className="text-xs text-gray-500">{brand}</p>}
              <h3 className="font-medium text-lg text-gray-900">{name}</h3>
            </div>

            {/* Description (only in list view) */}
            {description && (
              <p className="text-sm text-gray-600 mb-3 hidden sm:block">
                {truncateDescription(description)}
              </p>
            )}

            {/* Rating */}
            {rating !== undefined && (
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const diff = formattedRating - star;
                    return (
                      <span key={star} className="text-yellow-400">
                        {diff >= 0 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : diff >= -0.5 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4 text-gray-300"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        )}
                      </span>
                    );
                  })}
                </div>
                {review_count !== undefined && (
                  <span className="ml-1 text-xs text-gray-500">
                    ({review_count})
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="mt-auto">
              {hasDiscount ? (
                <div className="flex items-center gap-2">
                  <div className="font-bold text-accent text-lg">
                    {formatCurrency(displayPrice)}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    {formatCurrency(price)}
                  </div>
                </div>
              ) : (
                <div className="font-bold text-gray-900 text-lg">
                  {formatCurrency(displayPrice)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
