"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";
import { userApi } from "@/lib/api/userApi";
import { Cog6ToothIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await userApi.getProfile();

        if (response.success && response.data) {
          setProfileData(response.data);
        } else {
          setError(response.message || "Gagal memuat data profil");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Terjadi kesalahan yang tidak terduga");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default to using auth user if profile data isn't available
  const userData = profileData || user;

  if (!userData) {
    return (
      <div>
        <div className="text-center py-8">
          <p className="text-gray-500">Data profil tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b pb-5">
        <h1 className="text-2xl font-bold">Pengaturan Akun</h1>
        <p className="text-gray-500 mt-1">
          Kelola pengaturan dan keamanan akun Anda
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start mb-6">
          <div className="bg-blue-50 p-3 rounded-lg mr-4">
            <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Keamanan</h2>
            <p className="text-gray-500 text-sm">
              Kelola kata sandi dan pengaturan keamanan akun Anda
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Ubah Kata Sandi</h3>
          <PasswordChangeForm />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start mb-6">
          <div className="bg-purple-50 p-3 rounded-lg mr-4">
            <Cog6ToothIcon className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Preferensi</h2>
            <p className="text-gray-500 text-sm">
              Sesuaikan pengalaman belanja Anda
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Notifikasi</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="email_notifications"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                defaultChecked
              />
              <div className="ml-3">
                <label
                  htmlFor="email_notifications"
                  className="font-medium text-gray-700"
                >
                  Notifikasi Email
                </label>
                <p className="text-sm text-gray-500">
                  Terima informasi tentang pesanan dan produk yang Anda ikuti
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="marketing_emails"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <div className="ml-3">
                <label
                  htmlFor="marketing_emails"
                  className="font-medium text-gray-700"
                >
                  Email Promosi
                </label>
                <p className="text-sm text-gray-500">
                  Dapatkan promo spesial dan penawaran diskon terbaru
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
