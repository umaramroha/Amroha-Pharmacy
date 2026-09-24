"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo, useEffect } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number | null;
  image: string | null;
  category: string | null;
  description: string | null;
};

const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under ₹300", value: "0-300" },
  { label: "₹300 - ₹500", value: "300-500" },
  { label: "Above ₹500", value: "500-99999" },
];

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const query = searchParams.get("q") || "";

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (query) params.set("q", query);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setAllProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, query]);

  // Client-side price filter + sort
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [allProducts, priceRange, sortBy]);

  const categoryTitles: Record<string, string> = {
    "male-problems": "Male Problems",
    "female-problems": "Female Problems",
    "general-problems": "General Problems",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
        {query
          ? `Search: "${query}"`
          : category
          ? categoryTitles[category] || "Our Products"
          : "Our Products"}
      </h1>
      <p className="text-gray-600 mb-6">
        {loading ? "Loading..." : `${filteredProducts.length} product(s) found`}
      </p>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            !category
              ? "bg-primary text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-primary hover:text-white"
          }`}
        >
          All
        </Link>
        <Link
          href="/products?category=male-problems"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            category === "male-problems"
              ? "bg-primary text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-primary hover:text-white"
          }`}
        >
          Male Problems
        </Link>
        <Link
          href="/products?category=female-problems"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            category === "female-problems"
              ? "bg-primary text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-primary hover:text-white"
          }`}
        >
          Female Problems
        </Link>
        <Link
          href="/products?category=general-problems"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            category === "general-problems"
              ? "bg-primary text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-primary hover:text-white"
          }`}
        >
          General Problems
        </Link>
      </div>

      {/* Price + Sort Bar */}
      <div className="bg-white rounded-lg border shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Price:</span>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setPriceRange(range.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  priceRange === range.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary bg-white"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-2 text-gray-700">
            No products found
          </h2>
          <p className="text-gray-500 mb-6">
            Try changing your search or filter.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full font-semibold transition"
          >
            Clear All Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => {
            const mrp = product.mrp || product.price;
            const discount = Math.round(((mrp - product.price) / mrp) * 100);
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border group"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                      💊
                    </div>
                  )}
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      ₹{product.price}
                    </span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.mrp}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 text-center">
          Loading products...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
