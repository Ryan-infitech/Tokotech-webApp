"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileCard from "@/components/account/ProfileCard";
import ProfileForm from "@/components/account/ProfileForm";
import { userApi } from "@/lib/api/userApi";
import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function ProfilePage() {
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
          setError(response.message || "Failed to load profile data");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("An unexpected error occurred");
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
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
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
          <p className="text-gray-500">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProfileCard user={userData} />

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Informasi Personal</h2>
        <ProfileForm userData={userData} />
      </div>

      {/* Link to settings page */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Pengaturan Akun</h2>
            <p className="text-gray-500 mt-1">
              Kelola kata sandi dan preferensi akun Anda
            </p>
          </div>
          <Link 
            href="/account/settings" 
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Cog6ToothIcon className="h-5 w-5 mr-2 text-gray-500" />
            <span>Buka Pengaturan</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
