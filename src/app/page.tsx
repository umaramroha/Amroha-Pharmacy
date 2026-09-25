"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Ayurvedic & Unani Trusted Care",
      subtitle: "Authentic traditional medicines delivered to your doorstep",
      cta: "Shop Now",
      href: "/products",
      bg: "from-primary to-primary-dark",
    },
    {
      title: "Free Delivery Above ₹500",
      subtitle: "Fast delivery all over India with Cash on Delivery",
      cta: "Browse Products",
      href: "/products",
      bg: "from-secondary to-secondary-dark",
    },
    {
      title: "Order on WhatsApp",
      subtitle: "Quick ordering, expert guidance, and easy support",
      cta: "Chat Now",
      href: "https://wa.me/918077988509",
      bg: "from-primary-dark to-primary",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div>
      {/* Hero Slider */}
      <section
        className={`bg-gradient-to-br ${slides[currentSlide].bg} text-white py-16 md:py-24 transition-all duration-700 relative overflow-hidden`}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {slides[currentSlide].title}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {slides[currentSlide].subtitle}
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            {slides[currentSlide].href.startsWith("http") ? (
              <a
                href={slides[currentSlide].href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary hover:bg-secondary-dark text-white px-8 py-3 rounded-full font-semibold transition shadow-lg"
              >
                {slides[currentSlide].cta}
              </a>
            ) : (
              <Link
                href={slides[currentSlide].href}
                className="bg-secondary hover:bg-secondary-dark text-white px-8 py-3 rounded-full font-semibold transition shadow-lg"
              >
                {slides[currentSlide].cta}
              </Link>
            )}
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-full font-semibold transition"
            >
              Contact Us
            </Link>
          </div>

          {/* Slider Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  currentSlide === idx
                    ? "bg-white w-8"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-2 p-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-xs md:text-sm font-semibold text-gray-700">
                100% Authentic
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 p-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <p className="text-xs md:text-sm font-semibold text-gray-700">
                Fast Delivery
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 p-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">💵</span>
              </div>
              <p className="text-xs md:text-sm font-semibold text-gray-700">
                COD Available
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 p-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-xs md:text-sm font-semibold text-gray-700">
                WhatsApp Support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Concern */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3 text-primary">
            Shop by Concern
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Har samasya ka natural samadhan — Ayurvedic aur Unani experts dwara approved
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[
  { name: "Men's Vitality", icon: "🦁", slug: "mens-vitality" },
  { name: "Sexual Health", icon: "🛡️", slug: "sexual-health" },
  { name: "Male Fertility", icon: "👶", slug: "male-fertility" },
  { name: "Women's Health", icon: "💗", slug: "womens-health" },
  { name: "Likoria", icon: "🩺", slug: "white-discharge" },
  { name: "Gastric & Acidity", icon: "🫀", slug: "gastric-digestion" },
  { name: "Weight Loss", icon: "📏", slug: "weight-loss" },
  { name: "Weight Gain", icon: "💪", slug: "weight-gain" },
  { name: "Joints & Pain", icon: "🦵", slug: "joints-pain" },
  { name: "Diabetes", icon: "🩸", slug: "diabetes" },
].map((concern) => (
              <Link
                key={concern.slug}
                href={`/products?concern=${concern.slug}`}
                className="group flex flex-col items-center text-center p-3 rounded-xl hover:bg-primary/5 transition"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:scale-105 transition duration-300">
                  <span className="text-3xl md:text-4xl">{concern.icon}</span>
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-800 group-hover:text-primary transition">
                  {concern.name}
                </h3>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-block text-primary font-semibold hover:underline"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-primary">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/products?category=male-problems"
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition text-center border-t-4 border-primary"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">💊</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary">
                Male Problems
              </h3>
              <p className="text-gray-600 text-sm">
                Ayurvedic & Unani solutions for men&apos;s health
              </p>
            </Link>

            <Link
              href="/products?category=female-problems"
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition text-center border-t-4 border-secondary"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">🌸</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-secondary">
                Female Problems
              </h3>
              <p className="text-gray-600 text-sm">
                Trusted remedies for women&apos;s wellness
              </p>
            </Link>

            <Link
              href="/products?category=general-problems"
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition text-center border-t-4 border-green-600"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-green-700">
                General Problems
              </h3>
              <p className="text-gray-600 text-sm">
                Everyday health solutions for the whole family
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                Best Sellers
              </h2>
              <p className="text-gray-600">Hamare sabse popular products</p>
            </div>
            <Link
              href="/products"
              className="text-primary font-semibold hover:underline whitespace-nowrap"
            >
              View All →
            </Link>
          </div>

          <FeaturedProducts />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-primary">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Authentic Products</h3>
              <p className="text-gray-600">
                100% genuine Ayurvedic & Unani medicines from trusted sources.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick delivery all over India with Cash on Delivery option.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Guidance from qualified Ayurvedic & Unani experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3 text-primary">
            Customer Reviews
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Hamare customers kya kehte hain
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex gap-1 text-secondary mb-3">
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </div>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                &ldquo;Bahut achhi quality ki medicines hain. Delivery bhi fast
                thi. Highly recommended!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <p className="font-semibold text-sm">Rahul Khan</p>
                  <p className="text-xs text-gray-500">Amroha</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex gap-1 text-secondary mb-3">
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </div>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                &ldquo;WhatsApp pe order karna bahut aasan tha. Saath hi
                guidance bhi mili. Thank you Amroha Pharmacy!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                  F
                </div>
                <div>
                  <p className="font-semibold text-sm">Fatima Ansari</p>
                  <p className="text-xs text-gray-500">Moradabad</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex gap-1 text-secondary mb-3">
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </div>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                &ldquo;Genuine products aur reasonable price. Maine apne poore
                family ke liye yahan se order kiya.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="font-semibold text-sm">Adnan Ali</p>
                  <p className="text-xs text-gray-500">Delhi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-3 text-primary">
            Get Health Tips & Offers
          </h2>
          <p className="text-gray-600 mb-6">
            Ayurvedic health tips aur exclusive offers paane ke liye subscribe
            karein
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const email = (e.target as any).email.value;
              const msg = `📧 Newsletter Subscribe\n\nEmail: ${email}\n\nMujhe health tips aur offers bhejna.`;
              window.open(
                `https://wa.me/918410127168?text=${encodeURIComponent(msg)}`,
                "_blank"
              );
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            Hum aapki email safe rakhte hain. Koi spam nahi.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            Need Help Choosing?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Our experts are here to help you find the right medicine for your
            health needs.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Talk to an Expert
          </Link>
        </div>
      </section>
    </div>
  );
}
