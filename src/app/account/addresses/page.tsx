"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { userApi } from "@/lib/api/userApi";
import AddressForm, { AddressFormData } from "@/components/AddressForm";

export default function EditAddressPage() {
  const params = useParams();
  const router = useRouter();
  const [address, setAddress] = useState<AddressFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setIsLoading(true);
        const addressId = params.id;
        const addresses = await userApi.getAddresses();

        if (addresses.success) {
          const foundAddress = addresses.data.find(
            (addr: any) => addr.id.toString() === addressId
          );

          if (foundAddress) {
            setAddress(foundAddress);
          } else {
            setError("Alamat tidak ditemukan");
          }
        } else {
          setError(addresses.message || "Gagal mengambil data alamat");
        }
      } catch (err) {
        console.error("Error fetching address:", err);
        setError("Terjadi kesalahan saat mengambil data alamat");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchAddress();
    }
  }, [params.id]);

  const handleSubmit = async (data: AddressFormData) => {
    if (!params.id) return;

    setIsSubmitting(true);
    try {
      // Create a clean address object without metadata fields
      const addressData = {
        name: data.name,
        phone: data.phone || "",
        address_line1: data.address_line1,
        address_line2: data.address_line2 || "",
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country || "Indonesia",
        is_default: data.is_default,
        province_id: data.province_id,
        city_id: data.city_id,
      };

      console.log("Sending address data:", addressData);
      const response = await userApi.updateAddress(
        params.id.toString(),
        addressData
      );

      if (response.success) {
        toast.success("Alamat berhasil diperbarui");
        router.push("/account/addresses");
      } else {
        toast.error(response.message || "Gagal memperbarui alamat");
      }
    } catch (error) {
      console.error("Failed to update address:", error);
      toast.error("Terjadi kesalahan saat memperbarui alamat");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !address) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h2 className="text-lg font-medium text-red-800">Error</h2>
        <p className="mt-1 text-sm text-red-700">
          {error || "Alamat tidak ditemukan"}
        </p>
        <button
          onClick={() => router.push("/account/addresses")}
          className="mt-4 px-4 py-2 bg-white text-red-600 rounded-md border border-red-300 hover:bg-red-50"
        >
          Kembali ke Daftar Alamat
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Edit Alamat</h2>
      <AddressForm
        initialData={address}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => router.push("/account/addresses")}
      />
    </div>
  );
}
