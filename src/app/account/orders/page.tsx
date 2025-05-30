"use client";

import React, { useState, useEffect } from "react";
import { userApi } from "@/lib/api/userApi";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { formatPrice, formatDate } from "@/lib/formatters";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

// Define interfaces for our data structures
interface OrderItem {
  id: string | number;
  product_name: string;
  product_id: string | number;
  unit_price: number;
  quantity: number;
  products?: {
    image_url?: string;
  };
}

interface Order {
  id: string | number;
  order_number?: string;
  status: string;
  created_at: string;
  total_amount: number;
  order_items?: OrderItem[];
}

interface PaginationData {
  pages: number;
  current: number;
  total: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userApi.getOrders(page);
      if (response.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.pagination.pages || 1);
      } else {
        setError(response.message || "Gagal mengambil data pesanan");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Terjadi kesalahan yang tidak terduga");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => fetchOrders(currentPage)}>Coba Lagi</Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="mx-auto w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-6">
          <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-medium mb-2">Belum ada pesanan</h2>
        <p className="text-gray-500 mb-6">
          Pesanan Anda akan muncul di sini setelah Anda melakukan pembelian
        </p>
        <Button href="/products">Mulai Berbelanja</Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pesanan Saya</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between flex-wrap gap-2 mb-4">
              <div>
                <div className="text-sm text-gray-500">
                  Pesanan #{order.order_number || order.id}
                </div>
                <div className="font-medium">
                  {order.created_at ? formatDate(order.created_at) : "N/A"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Status</div>
                <div
                  className={`font-medium ${
                    order.status === "delivered"
                      ? "text-green-600"
                      : order.status === "processing"
                      ? "text-blue-600"
                      : order.status === "shipped"
                      ? "text-purple-600"
                      : order.status === "cancelled"
                      ? "text-red-600"
                      : "text-orange-600"
                  }`}
                >
                  {order.status === "pending"
                    ? "Tertunda"
                    : order.status === "processing"
                    ? "Diproses"
                    : order.status === "shipped"
                    ? "Dikirim"
                    : order.status === "delivered"
                    ? "Terkirim"
                    : order.status === "cancelled"
                    ? "Dibatalkan"
                    : order.status === "refunded"
                    ? "Dikembalikan"
                    : order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                </div>
              </div>
            </div>

            <div className="border-t border-b py-4 my-4">
              {order.order_items?.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded relative overflow-hidden">
                      <Image
                        src={
                          item.products?.image_url || "/images/placeholder.png"
                        }
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{item.product_name}</div>
                      <div className="text-sm text-gray-500">
                        Jumlah: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatPrice(item.unit_price * item.quantity)}
                  </div>
                </div>
              ))}

              {order.order_items && order.order_items.length > 2 && (
                <div className="text-sm text-gray-500 mt-2">
                  + {order.order_items.length - 2} barang lainnya
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="font-medium text-lg">
                  {formatPrice(order.total_amount)}
                </div>
              </div>
              <Link href={`/account/orders/${order.id}`}>
                <Button variant="outline" size="sm">
                  Lihat Detail
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Sebelumnya
            </button>

            <span className="px-4 py-1">
              Halaman {currentPage} dari {totalPages}
            </span>

            <button
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Selanjutnya
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
