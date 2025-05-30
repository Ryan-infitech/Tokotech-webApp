"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

interface FilterOption {
  id: string;
  name: string;
}

interface PriceRange {
  min: number;
  max: number;
}

interface ProductFiltersProps {
  categories?: FilterOption[];
  brands?: FilterOption[];
  priceRanges?: PriceRange[];
  selectedCategory?: string;
  selectedBrand?: string;
  selectedPriceRange?: string;
  selectedSort?: string;
  onMobileFilterClose?: () => void;
  isMobileView?: boolean;
}

export default function ProductFilters({
  categories = [],
  brands = [],
  priceRanges = [
    { min: 0, max: 100 },
    { min: 100, max: 500 },
    { min: 500, max: 1000 },
    { min: 1000, max: 2000 },
    { min: 2000, max: 0 } // 0 means no upper limit
  ],
  selectedCategory,
  selectedBrand,
  selectedPriceRange,
  selectedSort,
  onMobileFilterClose,
  isMobileView = false
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const formatPriceRange = (range: PriceRange) => {
    if (range.max === 0) {
      return `$${range.min}+`;
    }
    return `$${range.min} - $${range.max}`;
  };

  const getRangeValue = (min: number, max: number) => {
    return `${min}-${max}`;
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === '') {
      params.delete(filterType);
    } else {
      params.set(filterType, value);
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`?${params.toString()}`);
  };

  const handlePriceFilter = () => {
    if (priceMin || priceMax) {
      const params = new URLSearchParams(searchParams.toString());
      const priceFilter = `${priceMin || 0}-${priceMax || 0}`;
      params.set('price', priceFilter);
      params.set('page', '1');
      router.push(`?${params.toString()}`);
    }
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Keep only search and sort parameters
    const keepParams = ['q', 'sort'];
    
    Array.from(params.keys()).forEach(key => {
      if (!keepParams.includes(key)) {
        params.delete(key);
      }
    });
    
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const FilterSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className={`${isMobileView ? 'p-4' : ''}`}>
      {isMobileView && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Filters</h2>
          <button 
            onClick={onMobileFilterClose}
            className="text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* Categories Filter */}
        {categories.length > 0 && (
          <FilterSection title="Categories">
            <div className="space-y-2">
              <div 
                className={`cursor-pointer p-2 rounded ${!selectedCategory ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleFilterChange('category', '')}
              >
                All Categories
              </div>
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className={`cursor-pointer p-2 rounded ${selectedCategory === category.id ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => handleFilterChange('category', category.id)}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Brands Filter */}
        {brands.length > 0 && (
          <FilterSection title="Brands">
            <div className="space-y-2">
              <div 
                className={`cursor-pointer p-2 rounded ${!selectedBrand ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleFilterChange('brand', '')}
              >
                All Brands
              </div>
              {brands.map((brand) => (
                <div 
                  key={brand.id}
                  className={`cursor-pointer p-2 rounded ${selectedBrand === brand.id ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => handleFilterChange('brand', brand.id)}
                >
                  {brand.name}
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Price Ranges */}
        <FilterSection title="Price">
          <div className="space-y-2">
            <div 
              className={`cursor-pointer p-2 rounded ${!selectedPriceRange ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
              onClick={() => handleFilterChange('price', '')}
            >
              All Prices
            </div>
            {priceRanges.map((range, index) => (
              <div 
                key={index}
                className={`cursor-pointer p-2 rounded ${selectedPriceRange === getRangeValue(range.min, range.max) ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
                onClick={() => handleFilterChange('price', getRangeValue(range.min, range.max))}
              >
                {formatPriceRange(range)}
              </div>
            ))}
          </div>

          {/* Custom Price Range */}
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="price-min" className="block text-sm text-gray-600">Min ($)</label>
                <input
                  id="price-min"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="price-max" className="block text-sm text-gray-600">Max ($)</label>
                <input
                  id="price-max"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  min="0"
                />
              </div>
            </div>
            <Button variant="outline" fullWidth onClick={handlePriceFilter}>Apply</Button>
          </div>
        </FilterSection>

        {/* Sort Options */}
        <FilterSection title="Sort By">
          <div className="space-y-2">
            <div 
              className={`cursor-pointer p-2 rounded ${!selectedSort ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
              onClick={() => handleFilterChange('sort', '')}
            >
              Relevance
            </div>
            <div 
              className={`cursor-pointer p-2 rounded ${selectedSort === 'price_asc' ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
              onClick={() => handleFilterChange('sort', 'price_asc')}
            >
              Price: Low to High
            </div>
            <div 
              className={`cursor-pointer p-2 rounded ${selectedSort === 'price_desc' ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
              onClick={() => handleFilterChange('sort', 'price_desc')}
            >
              Price: High to Low
            </div>
            <div 
              className={`cursor-pointer p-2 rounded ${selectedSort === 'newest' ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
              onClick={() => handleFilterChange('sort', 'newest')}
            >
              Newest Arrivals
            </div>
            <div 
              className={`cursor-pointer p-2 rounded ${selectedSort === 'rating' ? 'bg-accent text-white' : 'hover:bg-gray-100'}`}
              onClick={() => handleFilterChange('sort', 'rating')}
            >
              Highest Rated
            </div>
          </div>
        </FilterSection>

        {/* Clear All Filters Button */}
        <div className="mt-6">
          <Button variant="outline" fullWidth onClick={handleClearFilters}>
            Clear All Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
