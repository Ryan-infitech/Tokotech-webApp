import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

interface Category {
  id: string;
  name: string;
  slug: string;
  category_parent_id: string | null;
  parent_id?: string | null;  // Alternative name that might be used
  image_url?: string;
  children?: Category[];
}

interface CategoryTreeProps {
  categories: Category[];
  onSelect?: (category: Category) => void;
  activeCategory?: string;
  expandAll?: boolean;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ 
  categories, 
  onSelect, 
  activeCategory,
  expandAll = false
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Build tree hierarchy - organize categories into a nested structure
  const buildCategoryTree = (cats: Category[]): Category[] => {
    console.log('Building category tree with', cats.length, 'categories');
    
    const categoryMap: Record<string, Category> = {};
    const rootCategories: Category[] = [];
    
    // First pass: map categories by ID
    cats.forEach(cat => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });
    
    // Second pass: build the tree - handle both field names for compatibility
    cats.forEach(cat => {
      // Try both field names for parent
      const parentId = cat.category_parent_id || cat.parent_id;
      console.log(`Category: ${cat.name}, Parent ID: ${parentId || 'None'}`);
      
      if (parentId && categoryMap[parentId]) {
        // This is a child category - add to parent's children array
        if (!categoryMap[parentId].children) {
          categoryMap[parentId].children = [];
        }
        categoryMap[parentId].children!.push(categoryMap[cat.id]);
      } else {
        // This is a root category (no parent or parent doesn't exist)
        rootCategories.push(categoryMap[cat.id]);
      }
    });
    
    console.log('Root categories:', rootCategories.length);
    return rootCategories;
  };
  
  // Initialize expanded state when categories change or expandAll changes
  useEffect(() => {
    if (expandAll) {
      const expanded: Record<string, boolean> = {};
      categories.forEach(cat => {
        expanded[cat.id] = true;
      });
      setExpandedCategories(expanded);
    }
  }, [categories, expandAll]);
  
  // Toggle category expansion
  const toggleCategory = (catId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };
  
  // Determine if a category has the active product
  const isCategoryActive = (category: Category): boolean => {
    if (!activeCategory) return false;
    
    if (category.id === activeCategory) return true;
    
    if (category.children && category.children.length > 0) {
      return category.children.some(child => isCategoryActive(child));
    }
    
    return false;
  };
  
  // Expand categories that contain the active item
  useEffect(() => {
    if (activeCategory) {
      const categoryTree = buildCategoryTree(categories);
      
      // Helper function to find and expand parent categories
      const expandActiveParents = (cats: Category[]): boolean => {
        for (const cat of cats) {
          if (cat.id === activeCategory) {
            return true;
          }
          
          if (cat.children && cat.children.length > 0) {
            const hasActive = expandActiveParents(cat.children);
            if (hasActive) {
              setExpandedCategories(prev => ({
                ...prev,
                [cat.id]: true
              }));
              return true;
            }
          }
        }
        return false;
      };
      
      expandActiveParents(categoryTree);
    }
  }, [categories, activeCategory]);
  
  // Render category tree
  const renderCategories = (cats: Category[], depth = 0) => {
    return cats.map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isActive = category.id === activeCategory;
      const isExpanded = !!expandedCategories[category.id];
      
      return (
        <li key={category.id} className={`${depth > 0 ? 'ml-4' : ''}`}>
          <div className="flex items-center">
            {/* Expand/collapse icon for categories with children */}
            {hasChildren ? (
              <button
                onClick={(e) => toggleCategory(category.id, e)}
                className="p-1 text-gray-400 hover:text-gray-700 focus:outline-none"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </button>
            ) : (
              <span className="w-6"></span>
            )}
            
            {/* Category link */}
            {onSelect ? (
              <button
                onClick={() => onSelect(category)}
                className={`py-1 px-2 text-sm rounded hover:bg-gray-100 ${
                  isActive ? 'font-medium text-primary' : 'text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ) : (
              <Link 
                href={`/categories/${category.slug}`}
                className={`py-1 px-2 text-sm rounded hover:bg-gray-100 ${
                  isActive ? 'font-medium text-primary' : 'text-gray-700'
                }`}
              >
                {category.name}
              </Link>
            )}
          </div>
          
          {/* Render children if expanded */}
          {hasChildren && isExpanded && (
            <ul className="mt-1 space-y-1">
              {renderCategories(category.children!, depth + 1)}
            </ul>
          )}
        </li>
      );
    });
  };
  
  const categoryTree = buildCategoryTree(categories);
  
  return (
    <ul className="space-y-1">
      {renderCategories(categoryTree)}
    </ul>
  );
};

export default CategoryTree;
