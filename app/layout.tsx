import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import SnowFall from "@/components/SnowFall";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
//add Toaster component
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CeyloTek",
  description: "CeyloTek E-commerce Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Toaster for notifications */}
        <Toaster position="top-right" reverseOrder={false} />
        <AuthProvider>
          <CartProvider>
            <SnowFall />
            <SiteHeader />
            <main>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
