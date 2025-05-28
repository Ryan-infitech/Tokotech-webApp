import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthInitializer from "@/components/auth/AuthInitializer";
import SessionInitializer from "@/components/auth/SessionInitializer";
import GlobalCartListener from "@/components/cart/GlobalCartListener";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tokotech.live";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "TokoTech";
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  "Platform e-commerce yang menghubungkan Anda dengan teknologi terbaik melalui pengalaman belanja online yang luar biasa.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Toko Online Teknologi Terpercaya`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "toko online",
    "teknologi",
    "komputer",
    "gadget",
    "elektronik",
    "belanja online",
    "e-commerce",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    title: `${siteName} - Toko Online Teknologi Terpercaya`,
    description: siteDescription,
    siteName: siteName,
    images: [
      {
        url: `${siteUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Toko Online Teknologi Terpercaya`,
    description: siteDescription,
    images: [`${siteUrl}/images/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* Initializers and listeners */}
          <AuthInitializer />
          <SessionInitializer />
          <GlobalCartListener />

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-16">{children}</main>
            <Footer />
            <MobileBottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
