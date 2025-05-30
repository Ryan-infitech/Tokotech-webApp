"use client";

import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import { formatDate } from "@/lib/formatters";

// Expanded review interface to handle different possible structures
interface Review {
  id: string;
  product_id?: string;
  user_id: string;
  users?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    email?: string;
  };
  rating: number;
  review_title?: string;
  review_text?: string;
  title?: string; // Alternative field name
  content?: string; // Alternative field name
  is_verified_purchase: boolean;
  created_at: string;
  updated_at?: string;
}

interface Specification {
  id?: string;
  product_id?: string;
  spec_name: string;
  spec_value: string;
  display_order?: number;
}

interface ProductTabsProps {
  description: string;
  specifications?: Specification[];
  reviews?: Review[];
  averageRating: number;
  reviewCount: number;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ProductTabs: React.FC<ProductTabsProps> = ({
  description,
  specifications = [],
  reviews = [],
  averageRating = 0,
  reviewCount = 0,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = [
    { name: "Description", count: 1 },
    { name: "Specifications", count: specifications.length },
    { name: "Reviews", count: reviewCount },
  ];

  // Debug the review data structure and rating calculations
  console.log("ProductTabs received:", {
    reviewsCount: reviews.length,
    passedAverageRating: averageRating,
    passedReviewCount: reviewCount,
    firstReviewRating: reviews.length > 0 ? reviews[0]?.rating : 'No reviews'
  });

  // Calculate average rating from reviews if we have them
  const calculatedAverageRating = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + (Number(review.rating) || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  // Use the passed average rating if it's valid, otherwise use our calculated one
  const displayRating = averageRating > 0 ? averageRating : calculatedAverageRating;

  // Sort specifications by display order if available
  const sortedSpecs = [...specifications].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  // Improved getUserName function with better null checking
  function getUserName(review: Review): string {
    if (review.users && review.users.first_name) {
      return `${review.users.first_name} ${
        review.users.last_name || ""
      }`.trim();
    }

    return "Anonymous User";
  }

  // Get text content of review, handling different field names
  function getReviewText(review: Review): string {
    return review.review_text || review.content || "";
  }

  // Get title of review, handling different field names
  function getReviewTitle(review: Review): string {
    return review.review_title || review.title || "Review";
  }

  return (
    <div className="mt-10">
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  "py-3 px-5 border-b-2 text-sm font-medium",
                  selected
                    ? "border-accent text-accent"
                    : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
                )
              }
            >
              {tab.name}{" "}
              {tab.count > 0 && (
                <span className="ml-1 text-gray-500">({tab.count})</span>
              )}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          {/* Description Tab */}
          <Tab.Panel className="prose max-w-none">
            <div className="text-gray-700 space-y-4">
              {description ? (
                <p>{description}</p>
              ) : (
                <p className="text-gray-500 italic">No description provided.</p>
              )}
            </div>
          </Tab.Panel>

          {/* Specifications Tab */}
          <Tab.Panel>
            {sortedSpecs.length > 0 ? (
              <div className="overflow-hidden bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {sortedSpecs.map((spec) => (
                      <tr key={spec.id || spec.spec_name}>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                          {spec.spec_name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {spec.spec_value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No specifications available.
              </p>
            )}
          </Tab.Panel>

          {/* Reviews Tab */}
          <Tab.Panel>
            <div className="space-y-8">
              {/* Review Summary */}
              <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-4xl font-bold text-gray-900">
                    {displayRating.toFixed(1)}
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(displayRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Based on {reviewCount} reviews
                  </p>
                </div>
              </div>

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-6"
                    >
                      <div className="flex items-center mb-2">
                        <p className="font-medium text-gray-900">
                          {getUserName(review)}
                        </p>
                        <span className="mx-2 text-gray-500">•</span>
                        <p className="text-sm text-gray-500">
                          {formatDate(review.created_at)}
                        </p>

                        {review.is_verified_purchase && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>

                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {getReviewTitle(review)}
                      </h4>
                      <p className="text-gray-700">{getReviewText(review)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    This product has no reviews yet.
                  </p>
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProductTabs;
