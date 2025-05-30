"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    try {
      // Simulate API call
      setSubscribeStatus("loading");

      // In a real implementation, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubscribeStatus("success");
      setEmail("");

      // Reset status after 3 seconds
      setTimeout(() => {
        setSubscribeStatus("");
      }, 3000);
    } catch (error) {
      setSubscribeStatus("error");

      // Reset status after 3 seconds
      setTimeout(() => {
        setSubscribeStatus("");
      }, 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-16 border-t border-gray-200">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Top Section - Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-primary">Toko</span>
                <span>Tech</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Platform e-commerce yang menghubungkan Anda dengan teknologi
              terbaik melalui pengalaman belanja online yang luar biasa.
            </p>

            <div className="flex space-x-4 mt-6">
              {/* Social Media Links */}
              {[
                {
                  name: "Facebook",
                  href: "#",
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  name: "Instagram",
                  href: "#",
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  name: "Twitter",
                  href: "#",
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  ),
                },
                {
                  name: "LinkedIn",
                  href: "#",
                  icon: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Navigasi Cepat</h3>
            <ul className="space-y-2">
              {[
                { name: "Beranda", href: "/" },
                { name: "Produk", href: "/products" },
                { name: "Kategori", href: "/categories" },
                { name: "Tentang Kami", href: "/about" },
                { name: "Kontak", href: "/contact" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-primary hover:underline inline-flex items-center"
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="w-5 h-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                <span className="text-gray-600">
                  Jl. Prof. Dr. Hamka, Air Tawar Barat, Padang, Sumatera Barat
                </span>
              </li>
              <li className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 text-primary flex-shrink-0 mr-2" />
                <a
                  href="mailto:tokotech.ltd@gmail.com"
                  className="text-gray-600 hover:text-primary hover:underline"
                >
                  tokotech.ltd@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 text-primary flex-shrink-0 mr-2" />
                <a
                  href="tel:+6285157517798"
                  className="text-gray-600 hover:text-primary hover:underline"
                >
                  +62 851-5751-7798
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">
              Berlangganan Newsletter
            </h3>
            <p className="text-gray-600 mb-4">
              Dapatkan info terbaru tentang produk dan promo spesial.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Anda"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:ring-primary focus:border-primary"
                required
              />
              <button
                type="submit"
                disabled={subscribeStatus === "loading"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary hover:bg-primary-dark rounded-md text-white transition-colors"
              >
                {subscribeStatus === "loading" ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <ArrowRightIcon className="h-5 w-5" />
                )}
              </button>
            </form>

            {subscribeStatus === "success" && (
              <p className="mt-2 text-sm text-green-600">
                Terima kasih! Anda telah berlangganan newsletter kami.
              </p>
            )}

            {subscribeStatus === "error" && (
              <p className="mt-2 text-sm text-red-600">
                Terjadi kesalahan. Silakan coba lagi.
              </p>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <span className="text-sm text-gray-500 mr-2">
              Metode Pembayaran:
            </span>
            {[
              "BCA",
              "Mandiri",
              "BNI",
              "BRI",
              "DANA",
              "GoPay",
              "OVO",
              "QRIS",
            ].map((method) => (
              <span
                key={method}
                className="px-3 py-1 text-xs bg-gray-200 rounded-full text-gray-700"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Bottom - Copyright */}
        <div className="py-6 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} Toko Tech. All rights reserved. Dibuat oleh{" "}
            <a
              href="https://github.com/Ryan-infitech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Rian Septiawan
            </a>
          </p>

          <div className="mt-4 flex justify-center space-x-6">
            <Link
              href="/privacy-policy"
              className="text-xs text-gray-500 hover:text-primary hover:underline"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-500 hover:text-primary hover:underline"
            >
              Syarat &amp; Ketentuan
            </Link>
            <Link
              href="/faq"
              className="text-xs text-gray-500 hover:text-primary hover:underline"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
