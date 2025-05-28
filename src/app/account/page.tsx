"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { userApi } from "@/lib/api/userApi";
import { accountMenuItems } from "./layout";
import { useWishlist } from "@/hooks/useWishlist";
import {
  ShoppingBagIcon,
  MapPinIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  XCircleIcon,
  ShoppingCartIcon,
  CameraIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/utils/formatters";
import { formatPrice } from "@/lib/formatters";

// Define interfaces for data structures
interface Address {
  id: string | number;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
}

interface OrderItem {
  id: string | number;
  product_name: string;
  product_id: string | number;
  unit_price: number;
  quantity: number;
}

interface Order {
  id: string | number;
  order_number?: string;
  status: string;
  created_at: string;
  total_amount: number;
  items?: OrderItem[];
}

// Interface for enhanced user profile data
interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
  avatar_url?: string;
  cover_photo_url?: string;
  // Add any other profile fields here
}

export default function Dashboard() {
  const { user } = useAuth();
  const { wishlistItems } = useWishlist();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dashboardData, setDashboardData] = useState({
    addresses: { count: 0, default: null as Address | null },
    orders: { count: 0, recent: [] as Order[], pending: 0 },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile data - explicitly get profile to ensure we have the latest data
        const profileResponse = await userApi.getProfile();
        if (profileResponse.success) {
          setUserProfile(profileResponse.data);
        }

        // Fetch addresses
        const addressesResponse = await userApi.getAddresses();
        const addresses: Address[] = addressesResponse.success
          ? addressesResponse.data
          : [];
        const defaultAddress = addresses.find(
          (addr: Address) => addr.is_default
        );

        // Fetch orders
        const ordersResponse = await userApi.getOrders(1, 3);
        const orders: Order[] = ordersResponse.success
          ? ordersResponse.data.orders || []
          : [];
        const orderCount = ordersResponse.success
          ? ordersResponse.data.pagination?.total || 0
          : 0;

        // Count pending orders
        const pendingOrders = ordersResponse.success
          ? orders.filter(
              (order: Order) =>
                order.status === "processing" || order.status === "shipped"
            ).length
          : 0;

        setDashboardData({
          addresses: {
            count: addresses.length,
            default: defaultAddress || null,
          },
          orders: {
            count: orderCount,
            recent: orders,
            pending: pendingOrders,
          },
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to get status details
  const getOrderStatusInfo = (status: string) => {
    // Define a type for valid status keys
    type StatusKey =
      | "pending"
      | "processing"
      | "shipped"
      | "delivered"
      | "completed"
      | "cancelled";

    const statusMap = {
      pending: {
        icon: ClockIcon,
        color: "bg-yellow-100 text-yellow-800",
        label: "Tertunda",
      },
      processing: {
        icon: ClockIcon,
        color: "bg-blue-100 text-blue-800",
        label: "Diproses",
      },
      shipped: {
        icon: TruckIcon,
        color: "bg-indigo-100 text-indigo-800",
        label: "Dikirim",
      },
      delivered: {
        icon: CheckCircleIcon,
        color: "bg-green-100 text-green-800",
        label: "Terkirim",
      },
      completed: {
        icon: CheckCircleIcon,
        color: "bg-green-100 text-green-800",
        label: "Selesai",
      },
      cancelled: {
        icon: XCircleIcon,
        color: "bg-red-100 text-red-800",
        label: "Dibatalkan",
      },
    };

    // Safely access the statusMap with type checking
    const normalizedStatus = (status?.toLowerCase() || "") as StatusKey;
    return statusMap[normalizedStatus] || statusMap.pending;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        {/* Profile section skeleton */}
        <div className="h-48 rounded-xl bg-gray-200"></div>

        {/* Navigation menu skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-gray-200"></div>
          ))}
        </div>

        {/* Stats section skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 rounded-lg bg-gray-200"></div>
          <div className="h-28 rounded-lg bg-gray-200"></div>
          <div className="h-28 rounded-lg bg-gray-200"></div>
        </div>

        {/* Recent orders skeleton */}
        <div className="h-64 rounded-lg bg-gray-200"></div>
      </div>
    );
  }

  // Get profile data from userProfile if available, otherwise fall back to auth user
  const profileData = userProfile || user;

  return (
    <div className="space-y-8">
      {/* Profile Card with Cover Photo */}
      <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
        {/* Cover Photo Section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
          {(profileData as UserProfile)?.cover_photo_url ? (
            <Image
              src={(profileData as UserProfile).cover_photo_url as string}
              alt="Cover"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              <div className="text-center">
                <CameraIcon className="h-8 w-8 mx-auto mb-2" />
                <p>Belum ada foto sampul</p>
              </div>
            </div>
          )}

          {/* Edit Cover Button */}
          <Link
            href="/account/profile"
            className="absolute top-4 right-4 bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white p-2 rounded-full"
            title="Edit Foto Sampul"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </Link>

          {/* Profile Photo */}
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
              {profileData?.avatar_url ? (
                <Image
                  src={profileData.avatar_url}
                  alt={`${profileData.first_name || "User"}'s profile`}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-4xl font-bold">
                  {profileData?.first_name?.[0]?.toUpperCase() ||
                    profileData?.email?.[0]?.toUpperCase() ||
                    "?"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="pt-20 pb-6 px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {profileData?.first_name} {profileData?.last_name}
              </h1>
              <p className="text-gray-500">{profileData?.email}</p>
              {profileData?.phone && (
                <p className="text-gray-500">{profileData.phone}</p>
              )}
            </div>
            <Link
              href="/account/profile"
              className="mt-4 md:mt-0 inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Edit Profil
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Using account items with unique icons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {accountMenuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                bg-white rounded-xl p-5 flex flex-col items-center text-center 
                border border-gray-100 
                transition-all duration-200
                ${
                  item.path === "/account"
                    ? "border-primary bg-primary/5"
                    : "hover:shadow-md hover:border-primary/30"
                }
              `}
            >
              <div
                className={`p-3 rounded-full mb-3 ${
                  item.path === "/account" ? "bg-primary/10" : "bg-blue-50"
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${
                    item.path === "/account" ? "text-primary" : "text-blue-500"
                  }`}
                />
              </div>
              <h3
                className={`font-medium ${
                  item.path === "/account" ? "text-primary" : "text-gray-900"
                }`}
              >
                {item.labelId}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {item.descriptionId}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Orders Card */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Pesanan
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {dashboardData.orders.count}
                </h3>
                {dashboardData.orders.pending > 0 && (
                  <p className="text-sm text-primary mt-1">
                    {dashboardData.orders.pending} dalam proses
                  </p>
                )}
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-5 py-3 border-t">
            <Link
              href="/account/orders"
              className="text-sm text-primary font-medium flex items-center"
            >
              Lihat Riwayat Pesanan
              <ArrowRightIcon className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Addresses Card */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Alamat Tersimpan
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {dashboardData.addresses.count}
                </h3>
                {dashboardData.addresses.default ? (
                  <p className="text-sm text-green-600 mt-1">
                    Default: {dashboardData.addresses.default.name}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    Belum ada alamat default
                  </p>
                )}
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MapPinIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-5 py-3 border-t">
            <Link
              href="/account/addresses"
              className="text-sm text-primary font-medium flex items-center"
            >
              Kelola Alamat
              <ArrowRightIcon className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Wishlist Card */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Item Favorit
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {wishlistItems.length}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {wishlistItems.length === 0
                    ? "Wishlist Anda kosong"
                    : `${wishlistItems.length} item tersimpan`}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <HeartIcon className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-5 py-3 border-t">
            <Link
              href="/account/wishlist"
              className="text-sm text-primary font-medium flex items-center"
            >
              Lihat Wishlist
              <ArrowRightIcon className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pesanan Terbaru</h2>
          <Link
            href="/account/orders"
            className="text-sm text-primary font-medium hover:underline"
          >
            Lihat semua
          </Link>
        </div>

        <div className="divide-y">
          {dashboardData.orders.recent.length > 0 ? (
            dashboardData.orders.recent.map((order) => {
              const statusInfo = getOrderStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <ShoppingBagIcon className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Pesanan #
                          {order.order_number ||
                            String(order.id).substring(0, 8)}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                          <span>{formatDate(order.created_at)}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>{order.items?.length || 0} item</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="flex flex-col items-end mr-6">
                        <span className="font-semibold">
                          {formatPrice(order.total_amount)}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center mt-1 ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCartIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Belum ada pesanan
              </h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                Saat Anda membuat pembelian pertama, pesanan akan muncul di sini
                untuk Anda lacak.
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Jelajahi Produk
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Two-column Section: Default Address and Wishlist Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Default Address */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Alamat Pengiriman Default</h2>
            <Link
              href="/account/addresses"
              className="text-sm text-primary font-medium hover:underline"
            >
              Kelola
            </Link>
          </div>

          <div className="p-6">
            {dashboardData.addresses.default ? (
              <div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPinIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {dashboardData.addresses.default.name}
                    </h3>
                    <address className="text-sm text-gray-600 mt-1 not-italic">
                      <div>{dashboardData.addresses.default.address_line1}</div>
                      {dashboardData.addresses.default.address_line2 && (
                        <div>
                          {dashboardData.addresses.default.address_line2}
                        </div>
                      )}
                      <div>
                        {dashboardData.addresses.default.city},{" "}
                        {dashboardData.addresses.default.state}{" "}
                        {dashboardData.addresses.default.postal_code}
                      </div>
                      <div>{dashboardData.addresses.default.country}</div>
                      {dashboardData.addresses.default.phone && (
                        <div className="mt-1">
                          {dashboardData.addresses.default.phone}
                        </div>
                      )}
                    </address>
                    <div className="mt-4">
                      <Link
                        href={`/account/addresses/edit/${dashboardData.addresses.default.id}`}
                        className="text-sm text-primary font-medium hover:underline"
                      >
                        Edit Alamat
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Belum ada alamat default
                </h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                  Tambahkan alamat pengiriman untuk pengalaman checkout yang
                  lebih cepat
                </p>
                <div className="mt-6">
                  <Link
                    href="/account/addresses/add"
                    className="inline-flex px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    Tambah Alamat Baru
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Preview */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Wishlist</h2>
            <Link
              href="/account/wishlist"
              className="text-sm text-primary font-medium hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          <div className="p-6">
            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {wishlistItems.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.product?.slug || item.product_id}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                      {item.product?.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Tidak Ada Gambar
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm truncate group-hover:text-primary">
                      {item.product?.name || "Produk"}
                    </h3>
                    <div className="text-sm text-gray-700 mt-1">
                      {formatPrice(item.product?.price || 0)}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Wishlist Anda kosong
                </h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                  Simpan produk yang Anda sukai untuk referensi di masa
                  mendatang
                </p>
                <div className="mt-6">
                  <Link
                    href="/products"
                    className="inline-flex px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    Jelajahi Produk
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
