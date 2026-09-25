"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useAuth();

  const categories = [
    { name: "Male Problems", slug: "male-problems" },
    { name: "Female Problems", slug: "female-problems" },
    { name: "General Problems", slug: "general-problems" },
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* TOP ROW */}
{/* Top Bar */}
<div className="bg-primary text-white text-xs md:text-sm">
  <div className="container mx-auto px-4 py-1.5 flex justify-between items-center flex-wrap gap-2">
    <div className="flex items-center gap-4">
      <span>🚚 Free Delivery on ₹500+</span>
      <span className="hidden md:inline">💵 COD Available</span>
    </div>
    <div className="flex items-center gap-4">
      <a href="tel:+918410127168" className="hover:text-secondary transition">
        📞 +91 84101 27168
      </a>
      <a
        href="https://wa.me/918410127168"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-secondary transition"
      >
        💬 WhatsApp
      </a>
    </div>
  </div>
</div>
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="Amroha Pharmacy"
            width={56}
            height={56}
            className="w-12 h-12 md:w-14 md:h-14 object-contain"
          />
          <span className="hidden md:block font-bold text-primary text-lg">
            Amroha Pharmacy
          </span>
        </Link>

        {/* Search (Desktop) */}
        <div className="flex-1 max-w-xl mx-auto hidden md:block">
          <form action="/products" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search medicines, problems..."
              className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:border-primary"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 hover:bg-gray-100 rounded-full transition"
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0 -right-0 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User / Login */}
          {isLoggedIn && user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-full transition"
              >
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">
                  {user.name.split(" ")[0]}
                </span>
                <svg
                  className="w-3 h-3 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md py-2 w-48 z-50 border">
                    <div className="px-4 py-2 border-b">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-primary transition"
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-primary transition"
                    >
                      📦 My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 transition"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-block text-sm font-medium text-primary hover:text-primary-dark transition px-3 py-1.5 hover:bg-gray-100 rounded-full"
            >
              Login / Register
            </Link>
          )}

          <Link
            href="/admin/login"
            className="hidden md:inline-block text-xs text-gray-500 hover:text-primary transition px-2"
          >
            Admin
          </Link>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <form action="/products" className="relative">
          <input
            type="text"
            name="q"
            placeholder="Search medicines..."
            className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:border-primary"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </form>
      </div>

      {/* Navigation (Desktop) */}
      <nav className="hidden md:block bg-primary text-white">
        <div className="container mx-auto px-4 flex items-center gap-8 py-3 text-sm font-medium">
          <Link href="/" className="hover:text-secondary transition">
            Home
          </Link>
          <Link href="/products" className="hover:text-secondary transition">
            Products
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-secondary transition">
              Categories
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {categoriesOpen && (
              <div className="absolute left-0 top-full bg-white text-gray-800 shadow-lg rounded-md py-2 w-48 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-primary transition"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" className="hover:text-secondary transition">
            About Us
          </Link>
          <Link href="/blogs" className="hover:text-secondary transition">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-secondary transition">
            Contact Us
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-primary text-white">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-3 text-sm">
            {isLoggedIn && user ? (
              <div className="bg-white/10 rounded-lg p-3 mb-2">
                <p className="text-xs opacity-80">Signed in as</p>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs opacity-80">{user.email}</p>
              </div>
            ) : null}

            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>
            <div>
              <p className="text-secondary font-semibold mb-1">Categories</p>
              <div className="pl-3 flex flex-col gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </Link>
            <Link href="/blogs" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              Contact Us
            </Link>
            <hr className="border-white/20 my-1" />

            {isLoggedIn && user ? (
              <>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  👤 My Profile
                </Link>
                <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                  📦 My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-300"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                Login / Register
              </Link>
            )}

            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs opacity-70"
            >
              Admin Panel
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
