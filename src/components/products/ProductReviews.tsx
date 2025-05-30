import React from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  review_title: string;
  is_verified_purchase: boolean;
  created_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  reviews = [],
  averageRating = 0,
  reviewCount = 0,
}) => {
  if (reviews.length === 0) {
    return (
      <div className="py-6">
        <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
        <p className="text-gray-500">
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">
          Customer Reviews ({reviewCount})
        </h3>
        <div className="flex items-center">
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.round(averageRating) ? (
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                ) : (
                  <StarOutlineIcon className="w-5 h-5 text-yellow-400" />
                )}
              </span>
            ))}
          </div>
          <span className="text-sm font-medium">
            {averageRating.toFixed(1)} out of 5
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex justify-between mb-2">
              <div>
                <h4 className="font-medium">
                  {review.review_title || "Review"}
                </h4>
                <p className="text-sm text-gray-500">
                  By {review.user?.first_name || "Unknown"}{" "}
                  {review.user?.last_name || "User"}
                  {review.is_verified_purchase && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Verified Purchase
                    </span>
                  )}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(review.created_at)}
              </span>
            </div>

            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <p className="text-gray-700">{review.review_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
