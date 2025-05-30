import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/formatters";

interface RelatedProductsProps {
  relatedProducts: any[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  relatedProducts,
}) => {
  if (!relatedProducts || relatedProducts.length === 0) {
    return <p className="text-gray-500">No related products found</p>;
  }

  console.log("Related products:", relatedProducts);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {relatedProducts.map((item) => {
        // Extract the product data based on API structure
        const product = item.related_products || item;

        // Find primary image or first image
        let imageUrl = "/images/placeholder.png"; // Default image

        if (product.product_images && product.product_images.length > 0) {
          const primaryImage = product.product_images.find(
            (img: any) => img.is_primary
          );
          imageUrl =
            (primaryImage || product.product_images[0])?.image_url || imageUrl;
        }

        return (
          <Link
            href={`/products/${product.slug}`}
            key={product.id}
            className="group block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={imageUrl}
                alt={product.name || "Related product"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-1 truncate">
                {product.name}
              </h3>

              <div className="flex items-center">
                <span className="font-bold text-gray-900">
                  {formatPrice(product.sale_price || product.price)}
                </span>

                {product.sale_price && product.sale_price < product.price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RelatedProducts;
