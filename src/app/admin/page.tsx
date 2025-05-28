"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronRightIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ArrowPathIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatPrice } from "@/lib/formatters";
import { adminApi } from "@/lib/api/adminApi";
import SalesChart from "@/components/admin/dashboard/SalesChart";
import ProductPerformanceChart from "@/components/admin/dashboard/ProductPerformanceChart";
import OrderStatusChart from "@/components/admin/dashboard/OrderStatusChart";

// Define the interface for StatCard props
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: number;
  isPositive?: boolean;
  linkTo: string;
  bgColor?: string;
}

// Define the interface for Dashboard Order
interface DashboardOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
}

// Define interface for Dashboard Stats
interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  pendingOrders: number;
  recentOrders: DashboardOrder[];
}

// Stats Card Component - keep unchanged
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  isPositive,
  linkTo,
  bgColor = "bg-white",
}) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-sm p-6`}>
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-full ${
            bgColor === "bg-white"
              ? "bg-blue-100 text-blue-700"
              : "bg-white/20 text-white"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              isPositive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isPositive ? (
              <ArrowUpIcon className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownIcon className="w-3 h-3 mr-1" />
            )}
            {change}%
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <div className="font-bold text-2xl mb-2">{value}</div>
      <Link
        href={linkTo}
        className="text-sm text-primary flex items-center hover:underline"
      >
        Lihat detail
        <ChevronRightIcon className="h-4 w-4 ml-1" />
      </Link>
    </div>
  );
};

// The main dashboard component
const AdminDashboard = () => {
  const [stats, setStats] = React.useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [showDebug, setShowDebug] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Add new state for chart data with default placeholders
  const [chartData, setChartData] = React.useState({
    salesTrend: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Tahun Ini",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: "Tahun Lalu",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    },
    topProducts: [],
    orderStatus: [],
  });

  // Add loading state for charts
  const [chartsLoading, setChartsLoading] = React.useState(true);

  React.useEffect(() => {
    // Check if debug parameter is present in URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setShowDebug(urlParams.has("debug"));
    }

    const fetchDashboardData = async () => {
      // Declare cachedStats at the beginning of the function so it's in scope for the entire function
      let cachedStats = null;
      let cachedChartData = null;

      try {
        setIsLoading(true);
        setChartsLoading(true);
        setError(null);

        // Try to get cached data first for immediate display
        if (typeof window !== "undefined") {
          try {
            const cachedData = localStorage.getItem("admin-dashboard-cache");
            if (cachedData) {
              const parsedCache = JSON.parse(cachedData);
              if (parsedCache.success && parsedCache.data) {
                // Extract basic stats
                cachedStats = {
                  totalProducts: parsedCache.data.total_products || 0,
                  totalOrders: parsedCache.data.total_orders || 0,
                  totalRevenue: parsedCache.data.total_revenue || 0,
                  totalUsers: parsedCache.data.total_users || 0,
                  pendingOrders: parsedCache.data.pending_orders || 0,
                  recentOrders: parsedCache.data.recent_orders || [],
                };

                // Extract chart data if available
                if (parsedCache.data.charts) {
                  cachedChartData = parsedCache.data.charts;
                }

                // Show cached data immediately while we fetch fresh data
                setStats(cachedStats);
                if (cachedChartData) {
                  setChartData(cachedChartData);
                  setChartsLoading(false);
                }
                console.log("Displaying cached data while fetching fresh data");
              }
            }
          } catch (e) {
            console.error("Error reading cached dashboard data:", e);
          }
        }

        console.log("Making fresh dashboard data request");
        const dashboardStats = await adminApi.getDashboardStats();

        if (dashboardStats.success && dashboardStats.data) {
          console.log("Successfully loaded fresh dashboard data");

          // Extract basic stats
          const freshStats = {
            totalProducts: dashboardStats.data.total_products || 0,
            totalOrders: dashboardStats.data.total_orders || 0,
            totalRevenue: dashboardStats.data.total_revenue || 0,
            totalUsers: dashboardStats.data.total_users || 0,
            pendingOrders: dashboardStats.data.pending_orders || 0,
            recentOrders: dashboardStats.data.recent_orders || [],
          };

          // Update charts with real data if available
          if (dashboardStats.data.charts) {
            console.log("Updating charts with real data");
            setChartData(dashboardStats.data.charts);
          } else {
            console.log("No chart data available in API response");
          }

          // Always use fresh data if it's available
          setStats(freshStats);
        } else {
          if (!cachedStats) {
            // Only set error if we don't have cached data
            setError(
              dashboardStats.message || "Failed to fetch dashboard data"
            );
          } else {
            console.log("Using cached data due to fresh data failure");
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);

        if (!cachedStats) {
          setError("Failed to load dashboard data. Please try again.");
        }
      } finally {
        setIsLoading(false);
        setChartsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function for order status badge
  const getOrderStatusBadge = (status: string) => {
    const statusStyles: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    const statusLabels: { [key: string]: string } = {
      pending: "Tertunda",
      processing: "Diproses",
      shipped: "Dikirim",
      delivered: "Terkirim",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusLabels[status] || status}
      </span>
    );
  };

  // Add this logging to help debug chart data
  React.useEffect(() => {
    if (!chartsLoading && chartData) {
      console.log("Top products data:", chartData.topProducts);
      console.log("Order status data:", chartData.orderStatus);
      console.log("Sales trend data:", chartData.salesTrend);
    }
  }, [chartsLoading, chartData]);

  return (
    <AdminLayout>
      {/* Show debug information if ?debug parameter is present */}
      {showDebug && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <h2 className="text-amber-800 font-semibold mb-2">Debug Mode</h2>
          <p className="text-amber-700 text-sm mb-4">
            You&apos;re seeing this because you accessed the dashboard with the
            ?debug parameter.
          </p>
          <div className="mt-2 p-4 bg-white rounded border">
            <h3 className="font-medium mb-2">Current Stats:</h3>
            <pre className="text-xs overflow-auto max-h-[200px]">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-primary hover:underline"
          >
            Try again
          </button>
          <Link
            href="/admin?debug=true"
            className="ml-4 text-blue-600 hover:underline"
          >
            View in debug mode
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {/* Welcome Section - Enhanced with gradient */}
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 md:p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Selamat Datang, Admin!
          </h1>
          <p className="text-white/90">
            Berikut adalah ikhtisar tentang toko online Anda saat ini.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Produk"
            value={isLoading ? "..." : stats.totalProducts.toString()}
            icon={ShoppingBagIcon}
            linkTo="/admin/products"
          />
          <StatCard
            title="Total Pesanan"
            value={isLoading ? "..." : stats.totalOrders.toString()}
            icon={ShoppingCartIcon}
            linkTo="/admin/orders"
          />
          <StatCard
            title="Pendapatan Total"
            value={isLoading ? "..." : formatPrice(stats.totalRevenue)}
            icon={CurrencyDollarIcon}
            linkTo="/admin/reports"
            bgColor="bg-gradient-to-br from-primary to-blue-600 text-white"
          />
          <StatCard
            title="Total Pengguna"
            value={isLoading ? "..." : stats.totalUsers.toString()}
            icon={UserIcon}
            linkTo="/admin/users"
          />
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Tren Penjualan</h2>
              <p className="text-sm text-gray-500">
                Analisis penjualan sepanjang tahun
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => window.location.reload()}
                className="p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                title="Refresh Data"
              >
                <ArrowPathIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {chartsLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : chartData.salesTrend.datasets[0].data.every(
              (val) => val === 0
            ) ? (
            <div className="h-[300px] flex items-center justify-center text-center">
              <div className="text-gray-500">
                <p className="mb-2 font-medium">Belum ada data penjualan</p>
                <p className="text-sm">
                  Data penjualan akan ditampilkan setelah pesanan selesai
                </p>
              </div>
            </div>
          ) : (
            <SalesChart salesData={chartData.salesTrend} />
          )}
        </div>

        {/* Three Column Charts/Stats Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Produk Terlaris</h2>
                <p className="text-sm text-gray-500">
                  Produk dengan penjualan tertinggi
                </p>
              </div>
              <Link
                href="/admin/products"
                className="text-sm text-primary hover:underline flex items-center"
              >
                Lihat Semua Produk
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {chartsLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : chartData.topProducts?.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-center">
                <div className="text-gray-500">
                  <p className="mb-2 font-medium">
                    Belum ada data produk terlaris
                  </p>
                  <p className="text-sm">
                    Data akan muncul setelah ada pesanan dengan status
                    pembayaran &quot;paid&quot;
                  </p>
                </div>
              </div>
            ) : (
              <ProductPerformanceChart products={chartData.topProducts} />
            )}
          </div>

          {/* Order Status Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Status Pesanan</h2>
              <p className="text-sm text-gray-500">
                Distribusi status pesanan saat ini
              </p>
            </div>

            {chartsLoading ? (
              <div className="h-[250px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : chartData.orderStatus.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-center">
                <div className="text-gray-500">
                  <p className="mb-2 font-medium">Belum ada data pesanan</p>
                  <p className="text-sm">
                    Statistik pesanan akan ditampilkan di sini
                  </p>
                </div>
              </div>
            ) : (
              <OrderStatusChart statusData={chartData.orderStatus} />
            )}
          </div>
        </div>

        {/* Recent Orders Section - Improved styling */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div>
              <h2 className="font-semibold text-lg">Pesanan Terbaru</h2>
              <p className="text-xs text-gray-500">
                Transaksi terbaru dari pelanggan
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm text-primary hover:underline flex items-center"
            >
              Lihat Semua
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Pesanan
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                ) : stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          #{order.id.substring(0, 8)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {formatPrice(order.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getOrderStatusBadge(order.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions with enhanced styling */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-primary" />
            Tindakan Cepat
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link
              href="/admin/products/create"
              className="block w-full py-3 px-4 bg-primary text-white rounded-lg text-center font-medium hover:bg-primary-dark transition-colors"
            >
              <span className="flex items-center justify-center">
                <PlusIcon className="w-5 h-5 mr-2" />
                Tambah Produk Baru
              </span>
            </Link>
            <Link
              href="/admin/categories/create"
              className="block w-full py-3 px-4 bg-white text-primary border border-primary rounded-lg text-center font-medium hover:bg-primary/5 transition-colors"
            >
              <span className="flex items-center justify-center">
                <PlusIcon className="w-5 h-5 mr-2" />
                Tambah Kategori Baru
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/orders?status=pending"
              className="flex items-center justify-between p-4 bg-yellow-50 text-yellow-800 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-center">
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                <span>Pesanan Tertunda</span>
              </div>
              <span className="bg-yellow-200 text-yellow-800 text-xs font-medium px-2.5 py-1.5 rounded-full">
                {isLoading ? "..." : stats.pendingOrders}
              </span>
            </Link>
            <Link
              href="/admin/promotions"
              className="flex items-center justify-between p-4 bg-purple-50 text-purple-800 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a4 4 0 118 0v7m-8 0h8m-8 0H6.2c-.9 0-1.8-.4-2.4-1.1-.5-.7-.7-1.5-.5-2.4.3-1 1.1-1.9 2.2-2.3C6.5 7.1 7.5 7 8.6 7c1 0 2 .2 2.9.6.9.4 1.5 1 2 1.8.5.8.7 1.7 .5 2.6z"
                  />
                </svg>
                <span>Kelola Promosi</span>
              </div>
              <ArrowTrendingUpIcon className="w-5 h-5" />
            </Link>
          </div>

          {/* System Info */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Informasi Sistem
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Versi Aplikasi</span>
                <span className="text-gray-700 font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Terakhir Diperbarui</span>
                <span className="text-gray-700 font-medium">
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status Sistem</span>
                <span className="inline-flex items-center text-green-700 font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
