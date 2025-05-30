"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import MobileMenu from "./MobileMenu";
import Button from "@/components/ui/Button";
import LogoutConfirmModal from "@/components/auth/LogoutConfirmModal";
import { productApi } from "@/lib/api/productApi"; // Import the productApi

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  // Get cart items count
  const { items } = useCartStore();
  const cartItemCount = items.length;

  // Check if we're on the homepage
  const isHomePage = pathname === "/";

  // Handle scroll event for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle dropdown menu outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        // Optionally, you can show a loading indicator here

        // Navigate to products page with search query parameter
        router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);

        // Clear the search input
        setSearchQuery("");

        // Note: The actual API call will be handled by the Products page component
        // when it loads with the search parameter in the URL
      } catch (error) {
        console.error("Search error:", error);
        // Optionally handle error (show error message)
      }
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handler for logout action - Open logout modal
  const handleLogout = () => {
    setShowLogoutModal(true);
    setDropdownOpen(false);
  };

  // Confirm logout action
  const confirmLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 
        ${
          mobileMenuOpen || isScrolled
            ? "bg-white shadow-md"
            : isHomePage
            ? "bg-transparent"
            : "bg-white"
        }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex justify-between items-center py-4">
          {/* Reduced vertical padding from py-4 to py-3 for more compact header */}
          {/* Logo with image */}
          <Link
            href="/"
            className={`flex items-center ${
              mobileMenuOpen || !isHomePage || isScrolled
                ? "text-primary"
                : "text-white"
            }`}
          >
            <Image
              src="/images/Logomain.svg"
              alt="LogoTokoTech"
              width={40}
              height={40}
              className="mr-2"
            />
            <span className="text-xl font-bold">Toko Tech</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/categories"
              className={`hover:text-primary ${
                isHomePage && !isScrolled ? "text-white" : "text-gray-700"
              }`}
            >
              Kategori
            </Link>
            <Link
              href="/products"
              className={`hover:text-primary ${
                isHomePage && !isScrolled ? "text-white" : "text-gray-700"
              }`}
            >
              Produk
            </Link>
            <Link
              href="/deals"
              className={`hover:text-primary ${
                isHomePage && !isScrolled ? "text-white" : "text-gray-700"
              }`}
            >
              Promo
            </Link>
            <Link
              href="/about"
              className={`hover:text-primary ${
                isHomePage && !isScrolled ? "text-white" : "text-gray-700"
              }`}
            >
              Tentang Kami
            </Link>
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className={`hidden md:flex items-center rounded-full px-3 py-2 flex-grow max-w-md mx-4 
              ${
                isHomePage && !isScrolled
                  ? "bg-white/20 backdrop-blur-sm"
                  : "bg-gray-100"
              }`}
          >
            <input
              type="text"
              placeholder="Cari produk..."
              className={`bg-transparent border-none focus:outline-none text-sm px-2 py-1 flex-grow 
                ${
                  isHomePage && !isScrolled
                    ? "text-white placeholder-white/70"
                    : "text-gray-700"
                }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className={`p-1 rounded-full hover:bg-white/20 transition-colors 
                ${isHomePage && !isScrolled ? "text-white" : "text-gray-600"}`}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>

          {/* User Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Link */}
            <Link
              href="/cart"
              className={`relative p-2 ${
                isHomePage && !isScrolled ? "text-white" : "text-gray-700"
              }`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className={`flex items-center space-x-1 hover:text-primary 
                    ${
                      isHomePage && !isScrolled ? "text-white" : "text-gray-700"
                    }`}
                >
                  {/* Show profile image if available, otherwise default to icon */}
                  {user?.avatar_url ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={user.avatar_url}
                        alt={`${user.first_name || "Pengguna"}'s avatar`}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      {user?.first_name?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase() || (
                          <UserIcon className="h-5 w-5" />
                        )}
                    </div>
                  )}
                  <span className="text-sm font-medium">
                    {user?.first_name || "Akun"}
                  </span>
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20"
                    onMouseLeave={() =>
                      setTimeout(() => setDropdownOpen(false), 300)
                    }
                  >
                    <div className="py-2">
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Akun Saya
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Pesanan Saya
                      </Link>
                      {user?.role === "admin" ||
                      user?.role === "super_admin" ? (
                        <Link
                          href="/admin"
                          prefetch={false} // Disable prefetching for admin dashboard
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Dasbor Admin
                        </Link>
                      ) : null}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className={
                      isHomePage && !isScrolled
                        ? "text-white border-white hover:bg-white hover:text-primary"
                        : ""
                    }
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant={
                      isHomePage && !isScrolled ? "secondary" : "primary"
                    }
                    size="sm"
                  >
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <Link
              href="/cart"
              className={`relative p-2 mr-2 ${
                mobileMenuOpen || !isHomePage || isScrolled
                  ? "text-gray-700"
                  : "text-white"
              }`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 ${
                mobileMenuOpen || !isHomePage || isScrolled
                  ? "text-gray-700"
                  : "text-white"
              }`}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - using the improved component to fix hooks error */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
        user={user}
        isAuthenticated={isAuthenticated}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </header>
  );
}
