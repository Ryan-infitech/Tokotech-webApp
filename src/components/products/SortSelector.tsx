import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SortSelectorProps {
  currentSort?: string;
}

const SortSelector: React.FC<SortSelectorProps> = ({
  currentSort = "newest",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "name_asc", label: "Name: A-Z" },
    { value: "name_desc", label: "Name: Z-A" },
  ];

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update the sort parameter
    params.set("sort", e.target.value);

    // Reset page to 1 when changing sort
    if (params.has("page")) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort" className="text-sm text-gray-600">
        Sort by:
      </label>
      <select
        id="sort"
        name="sort"
        value={currentSort}
        onChange={handleSortChange}
        className="block w-full md:w-auto pl-3 pr-10 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortSelector;
