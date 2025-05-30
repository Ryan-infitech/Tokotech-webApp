"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <div
          className={`flex items-center border rounded-full bg-gray-50 transition-all ${
            isFocused
              ? "border-accent ring-2 ring-accent/20"
              : "border-gray-200"
          }`}
        >
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="py-2 pl-4 pr-10 text-sm bg-transparent outline-none w-full max-w-[180px] lg:max-w-none"
          />
          <button
            type="submit"
            className={`absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-accent`}
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
