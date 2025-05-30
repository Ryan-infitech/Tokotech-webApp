import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";

interface FilterSidebarProps {
  selectedBrand?: string | null;
  selectedPrice?: string | null;
  brands?: Array<{ id: string; name: string }>;
  isOpen?: boolean;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedBrand = null,
  selectedPrice = null,
  brands = [],
  isOpen = false,
  onClose = () => {},
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localBrands, setLocalBrands] = useState<string[]>([]);
  const [localPrice, setLocalPrice] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
    brands: false,
    price: false,
  });

  // Set initial state based on URL params
  useEffect(() => {
    setLocalBrands(selectedBrand ? [selectedBrand] : []);
    setLocalPrice(selectedPrice);
  }, [selectedBrand, selectedPrice]);

  const priceRanges = [
    { value: "0-100000", label: "Under Rp 100.000" },
    { value: "100000-500000", label: "Rp 100.000 - Rp 500.000" },
    { value: "500000-1000000", label: "Rp 500.000 - Rp 1.000.000" },
    { value: "1000000-2000000", label: "Rp 1.000.000 - Rp 2.000.000" },
    { value: "2000000-999999999", label: "Over Rp 2.000.000" },
  ];

  const handleBrandChange = (brand: string) => {
    const newBrands = localBrands.includes(brand)
      ? localBrands.filter((b) => b !== brand)
      : [...localBrands, brand];

    setLocalBrands(newBrands);
  };

  const handlePriceChange = (price: string) => {
    setLocalPrice(localPrice === price ? null : price);
  };

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update brand parameter
    if (localBrands.length === 0) {
      params.delete("brand");
    } else {
      params.set("brand", localBrands.join(","));
    }

    // Update price parameter
    if (localPrice) {
      params.set("price", localPrice);
    } else {
      params.delete("price");
    }

    // Reset page to 1 when applying new filters
    if (params.has("page")) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
    onClose();
  };

  const clearFilters = () => {
    setLocalBrands([]);
    setLocalPrice(null);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("brand");
    params.delete("price");

    // Keep other parameters like search query or category
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = localBrands.length > 0 || localPrice !== null;

  // Filter section component
  const FilterSection = ({
    title,
    children,
    section,
  }: {
    title: string;
    children: React.ReactNode;
    section: string;
  }) => {
    const isCollapsed = collapsedSections[section];

    return (
      <div className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
        <div
          className="flex justify-between items-center mb-4 cursor-pointer"
          onClick={() => toggleSection(section)}
        >
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
          {isCollapsed ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {!isCollapsed && children}
      </div>
    );
  };

  // Mobile Filter Drawer
  const MobileFilterDrawer = () => (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 z-10 px-4 py-3 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Filters{" "}
                    {hasActiveFilters && (
                      <span className="text-sm text-accent">(Active)</span>
                    )}
                  </h2>
                </div>
                <button
                  type="button"
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-4 py-6 space-y-8">
              {/* Brand filter section */}
              <FilterSection title="Brands" section="brands">
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center">
                      <input
                        id={`mobile-brand-${brand.id}`}
                        name={`mobile-brand-${brand.id}`}
                        type="checkbox"
                        checked={localBrands.includes(brand.id)}
                        onChange={() => handleBrandChange(brand.id)}
                        className="h-5 w-5 rounded border-gray-300 text-accent focus:ring-accent"
                      />
                      <label
                        htmlFor={`mobile-brand-${brand.id}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {brand.name}
                      </label>
                    </div>
                  ))}
                  {brands.length === 0 && (
                    <p className="text-sm text-gray-500">No brands available</p>
                  )}
                </div>
              </FilterSection>

              {/* Price filter section */}
              <FilterSection title="Price Range" section="price">
                <div className="space-y-3">
                  {priceRanges.map((range) => (
                    <div key={range.value} className="flex items-center">
                      <input
                        id={`mobile-price-${range.value}`}
                        name="mobile-price"
                        type="radio"
                        checked={localPrice === range.value}
                        onChange={() => handlePriceChange(range.value)}
                        className="h-5 w-5 border-gray-300 text-accent focus:ring-accent"
                      />
                      <label
                        htmlFor={`mobile-price-${range.value}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </FilterSection>
            </div>

            {/* Action buttons - fixed at bottom */}
            <div className="sticky bottom-0 px-4 py-3 bg-white border-t border-gray-200 flex items-center justify-between">
              {hasActiveFilters && (
                <button
                  type="button"
                  className="text-sm text-accent hover:text-accent-dark"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              )}
              <Button
                variant="primary"
                className={hasActiveFilters ? "flex-1 ml-3" : "w-full"}
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            className="text-sm text-accent hover:text-accent-dark"
            onClick={clearFilters}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Mobile filter drawer */}
      {isOpen && <MobileFilterDrawer />}

      {/* Desktop filters */}
      <div className="hidden lg:block space-y-8">
        {/* Brand filter section */}
        <FilterSection title="Brands" section="brands">
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {brands.length === 0 ? (
              <p className="text-sm text-gray-500">No brands available</p>
            ) : (
              brands.map((brand) => (
                <div key={brand.id} className="flex items-center">
                  <input
                    id={`brand-${brand.id}`}
                    name={`brand-${brand.id}`}
                    type="checkbox"
                    checked={localBrands.includes(brand.id)}
                    onChange={() => handleBrandChange(brand.id)}
                    className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <label
                    htmlFor={`brand-${brand.id}`}
                    className="ml-3 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {brand.name}
                  </label>
                </div>
              ))
            )}
          </div>
        </FilterSection>

        {/* Price filter section */}
        <FilterSection title="Price" section="price">
          <div className="space-y-3">
            {priceRanges.map((range) => (
              <div key={range.value} className="flex items-center">
                <input
                  id={`price-${range.value}`}
                  name="price"
                  type="radio"
                  checked={localPrice === range.value}
                  onChange={() => handlePriceChange(range.value)}
                  className="h-4 w-4 border-gray-300 text-accent focus:ring-accent"
                />
                <label
                  htmlFor={`price-${range.value}`}
                  className="ml-3 text-sm text-gray-600 hover:text-gray-900"
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Apply button */}
        <div className="pt-4">
          <Button variant="primary" className="w-full" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
