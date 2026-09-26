import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amroha Pharmacy - Ayurvedic & Unani Care",
  description:
    "Authentic Ayurvedic and Unani medicines in Amroha. Delivering wellness across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-background text-gray-800 antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex min-h-screen flex-col">
               
    <Header />

  <main className="flex-1 pb-16 md:pb-0">
    {children}
  </main>

  <Footer />
  <BottomNav />
</div>

            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
