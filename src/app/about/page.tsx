"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  CheckIcon,
  ArrowRightIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutPage() {
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form handling with real API call
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });

    const formData = {
      name: (e.currentTarget.elements.namedItem("name") as HTMLInputElement)
        .value,
      email: (e.currentTarget.elements.namedItem("email") as HTMLInputElement)
        .value,
      subject: (
        e.currentTarget.elements.namedItem("subject") as HTMLInputElement
      ).value,
      message: (
        e.currentTarget.elements.namedItem("message") as HTMLTextAreaElement
      ).value,
    };

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const response = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          type: "success",
          message:
            data.message ||
            "Pesan berhasil dikirim! Terima kasih telah menghubungi kami.",
        });
        e.currentTarget.reset();
      } else {
        setFormStatus({
          type: "error",
          message: data.message || "Terjadi kesalahan. Silakan coba lagi.",
        });
      }
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "Terjadi kesalahan pada sistem. Silakan coba lagi nanti.",
      });
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section - Changed to white background */}
      <section className="relative bg-white text-gray-900 py-24 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            >
              Toko tech
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-700"
            >
              Menghubungkan pengguna dengan teknologi terbaik melalui pengalaman
              belanja online yang luar biasa.
            </motion.p>
          </div>
        </div>
      </section>

      {/* About Toko Tech - Cleaner design */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-1/2 w-full"
            >
              <div className="relative w-full aspect-square md:aspect-video lg:h-80 rounded-lg overflow-hidden">
                <Image
                  src="/images/Logomain.png"
                  alt="Tech Shopping Experience"
                  fill
                  className="object-contain object-center"
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800">. . .</h2>

              <p className="text-lg text-gray-600 mb-6">
                Toko Tech adalah platform e-commerce modern yang fokus pada
                produk-produk teknologi dan gadget terkini. Kami berkomitmen
                untuk menyediakan pengalaman berbelanja online terbaik dengan
                seleksi produk berkualitas, harga kompetitif, dan pelayanan
                pelanggan yang luar biasa.
              </p>

              <p className="text-lg text-gray-600 mb-8">
                Didirikan pada tahun 2025, Toko Tech terus berkembang menjadi
                salah satu toko online terpercaya untuk kebutuhan teknologi dan
                elektronik di Indonesia.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "Produk Berkualitas",
                  "Pelayanan Responsif",
                  "Harga Kompetitif",
                  "Pengiriman Cepat",
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section - With modernized social links */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/3">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="bg-primary/10 absolute inset-0 rounded-lg -rotate-3"></div>
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/images/RIANSEPTIAWAN.JPG"
                    alt="Rian Septiawan"
                    width={400}
                    height={400}
                    className="object-cover aspect-square"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-2/3"
            >
              <h2 className="text-3xl font-bold mb-2 text-gray-800">
                Rian Septiawan
              </h2>
              <p className="text-primary font-medium mb-6">
                Founder & Lead Developer
              </p>

              <blockquote className="text-lg text-gray-600 mb-8 italic border-l-4 border-primary pl-4">
                &ldquo;Toko Tech adalah representasi dari visi saya untuk
                menciptakan platform e-commerce yang tidak hanya fungsional,
                tetapi juga memberikan pengalaman berbelanja yang menyenangkan
                bagi pengguna. Saya percaya teknologi harus dapat diakses oleh
                semua orang.&rdquo;
              </blockquote>

              <p className="text-gray-600 mb-8">
                Saya seorang Web Developer yang berdedikasi untuk menciptakan
                pengalaman digital yang luar biasa. Dengan fokus pada
                pengembangan aplikasi web modern dan e-commerce, saya
                menggabungkan teknologi terkini dengan desain yang berpusat pada
                pengguna.
              </p>

              {/* Modernized social links */}
              <div className="flex items-center gap-4">
                {[
                  {
                    name: "GitHub",
                    url: "https://github.com/Ryan-infitech",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    ),
                  },
                  {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com/in/rian-septiawan",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Instagram",
                    url: "https://www.instagram.com/ryan.septiawan__/",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    ),
                  },
                ].map((link, i) => (
                  <Link
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    className="flex items-center justify-center p-3 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    title={link.name}
                  >
                    <span className="sr-only">{link.name}</span>
                    {link.icon}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section - Simplified */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Visi Kami</h2>
            <p className="text-xl text-gray-600">
              &ldquo;Menjadi platform e-commerce terdepan yang menghubungkan
              masyarakat Indonesia dengan teknologi terbaik melalui pengalaman
              belanja online yang menyenangkan, aman, dan terpercaya.&rdquo;
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Kualitas",
                description:
                  "Kami hanya menawarkan produk teknologi berkualitas terbaik yang telah melalui proses kurasi ketat.",
              },
              {
                title: "Efisiensi",
                description:
                  "Platform kami dirancang untuk memberikan pengalaman berbelanja yang cepat, mudah, dan tanpa hambatan.",
              },
              {
                title: "Kepuasan",
                description:
                  "Kepuasan pelanggan adalah prioritas utama kami, dengan dukungan pelanggan yang responsif dan solusi cepat.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Hubungi Saya
            </h2>
            <p className="text-gray-600">
              Punya pertanyaan atau ingin berkolaborasi? Jangan ragu untuk
              menghubungi saya.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:w-3/5 bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-4">Kirim Pesan</h3>

              {formStatus.message && (
                <div
                  className={`p-4 rounded-md mb-6 ${
                    formStatus.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {formStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nama
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subjek
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-primary text-white rounded-md flex items-center justify-center transition-colors ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-primary-dark"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:w-2/5 space-y-4"
            >
              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start">
                <div className="mr-4 bg-primary/10 p-3 rounded-full">
                  <EnvelopeIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <a
                    href="mailto:rianseptiawan@student.unp.ac.id"
                    className="text-primary hover:underline"
                  >
                    rianseptiawan@student.unp.ac.id
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start">
                <div className="mr-4 bg-primary/10 p-3 rounded-full">
                  <PhoneIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Telepon</h3>
                  <a
                    href="tel:+6285157517798"
                    className="text-primary hover:underline"
                  >
                    +62 851-5751-7798
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start">
                <div className="mr-4 bg-primary/10 p-3 rounded-full">
                  <GlobeAltIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Website</h3>
                  <a
                    href="https://www.rianseptiawan.engineer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.rianseptiawan.engineer
                  </a>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg">
                <p className="text-gray-700">
                  Terima kasih telah mengunjungi Toko Tech. Saya berharap
                  pengalaman belanja online Anda menyenangkan.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center mt-4 text-primary font-medium hover:underline"
                >
                  Kembali ke Beranda
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
