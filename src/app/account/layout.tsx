"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import LogoutConfirmModal from "@/components/auth/LogoutConfirmModal";
import {
  UserCircleIcon,
  ShoppingBagIcon,
  HeartIcon,
  MapPinIcon,
  Cog6ToothIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Export menu items for use in dashboard
export const accountMenuItems = [
  {
    path: "/account",
    icon: HomeIcon,
    label: "Dashboard",
    labelId: "Dasbor",
    description: "Overview of your account",
    descriptionId: "Ringkasan akun Anda",
  },
  {
    path: "/account/profile",
    icon: UserCircleIcon,
    label: "Profile",
    labelId: "Profil",
    description: "Your personal information",
    descriptionId: "Informasi pribadi Anda",
  },
  {
    path: "/account/addresses",
    icon: MapPinIcon,
    label: "Addresses",
    labelId: "Alamat",
    description: "Shipping & billing addresses",
    descriptionId: "Alamat pengiriman & penagihan",
  },
  {
    path: "/account/orders",
    icon: ShoppingBagIcon,
    label: "Orders",
    labelId: "Pesanan",
    description: "Your order history",
    descriptionId: "Riwayat pesanan Anda",
  },
  {
    path: "/account/wishlist",
    icon: HeartIcon,
    label: "Wishlist",
    labelId: "Favorit",
    description: "Saved items for later",
    descriptionId: "Item tersimpan untuk nanti",
  },
  {
    path: "/account/settings",
    icon: Cog6ToothIcon,
    label: "Settings",
    labelId: "Pengaturan",
    description: "Account preferences",
    descriptionId: "Preferensi akun",
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { userProfile } = useUserProfile();
  const [mounted, setMounted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Handle mobile menu scroll lock
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  // Close mobile menu on navigation
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  // Client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth redirection
  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [isAuthenticated, isLoading, router, pathname, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat akun Anda...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Active menu item
  const getActiveMenu = () => {
    return accountMenuItems.find((item) => {
      if (item.path === "/account") {
        return pathname === "/account";
      }
      return pathname.startsWith(item.path);
    });
  };

  const activeMenu = getActiveMenu() || accountMenuItems[0];

  // Determine page title
  let pageTitle = activeMenu?.labelId || "Akun Saya";
  if (pathname.includes("/addresses/add")) pageTitle = "Tambah Alamat Baru";
  if (pathname.includes("/addresses/edit")) pageTitle = "Edit Alamat";
  if (pathname.includes("/orders/")) pageTitle = "Detail Pesanan";

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setShowMobileMenu(false);
  };

  const confirmLogout = () => {
    logout();
    router.push("/");
  };

  const profileData = userProfile || user;

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-6">
      {/* Mobile Header Title Bar - Only shown on mobile */}
      <div className="bg-white border-b md:hidden mb-4">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-medium">{pageTitle}</h1>

          {/* Mobile Dashboard Link - only show when not on dashboard */}
          {pathname !== "/account" && (
            <Link
              href="/account"
              className="text-primary text-sm font-medium flex items-center"
            >
              <HomeIcon className="w-4 h-4 mr-1" />
              Dasbor
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Navigation - Desktop Only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <nav className="space-y-1">
                {accountMenuItems.map((item) => {
                  const isActive =
                    (item.path === "/account" && pathname === "/account") ||
                    (item.path !== "/account" &&
                      pathname.startsWith(item.path));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-white font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-gray-500"
                        } mr-3 flex-shrink-0`}
                      />
                      <span>{item.labelId}</span>
                    </Link>
                  );
                })}

                <hr className="my-3" />

                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center px-4 py-2.5 rounded-lg text-left hover:bg-red-50 hover:text-red-600"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-500 mr-3" />
                  <span>Keluar</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm p-6">{children}</div>
          </main>
        </div>
      </div>

      {/* Mobile Menu Toggle Button (floating) - Positioned above MobileBottomNav */}
      <button
        onClick={() => setShowMobileMenu(true)}
        className="lg:hidden fixed bottom-20 right-6 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-30"
        aria-label="Buka menu"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed inset-0 bg-gray-800/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          showMobileMenu ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowMobileMenu(false)}
      >
        <div
          className={`fixed top-0 left-0 bottom-0 w-[280px] max-w-[80%] bg-white shadow-lg z-50 transition-transform duration-300 ${
            showMobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-bold text-xl text-primary">Akun Saya</div>
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* User Profile */}
            <div className="p-4 border-b">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  {profileData.avatar_url ? (
                    <Image
                      src={profileData.avatar_url}
                      alt={`${profileData.first_name || ""}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                      {profileData.first_name?.[0]?.toUpperCase() ||
                        profileData.email[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium">
                    {profileData.first_name} {profileData.last_name}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-[180px]">
                    {profileData.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items - Show ALL items in mobile menu */}
            <div className="overflow-y-auto flex-grow">
              <nav className="p-2">
                {accountMenuItems.map((item) => {
                  const isActive =
                    (item.path === "/account" && pathname === "/account") ||
                    (item.path !== "/account" &&
                      pathname.startsWith(item.path));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center px-4 py-3 mb-1 rounded-lg ${
                        isActive ? "bg-primary text-white" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-gray-500"
                        } mr-3 flex-shrink-0`}
                      />
                      <div>
                        <div>{item.labelId}</div>
                        <div
                          className={`text-xs ${
                            isActive ? "text-white/80" : "text-gray-500"
                          }`}
                        >
                          {item.descriptionId}
                        </div>
                      </div>
                      <ChevronRightIcon
                        className={`w-5 h-5 ml-auto ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Logout button */}
            <div className="p-4 border-t mt-auto">
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
}
