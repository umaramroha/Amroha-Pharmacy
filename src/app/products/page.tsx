"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo, useEffect } from "react";
import { concerns } from "@/data/concerns";
import ProductCard from "@/components/product/ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string;
  mrp: string | null;
  image: string | null;
  category: string | null;
  description: string | null;
  stock: number;
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
  const categoryParam = searchParams.get("category");
  const query = searchParams.get("q") || "";

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (categoryParam) params.set("category", categoryParam);
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
  }, [categoryParam, query]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((p) => {
        const price = parseFloat(p.price);
        return price >= min && price <= max;
      });
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
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

  const pageTitle = query
    ? `Search: "${query}"`
    : categoryParam
    ? categoryTitles[categoryParam] || "Our Products"
    : "Our Products";

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-primary mb-3">Shop by Concern</h3>
        <div className="space-y-1.5">
          {concerns.map((c) => (
            <Link
              key={c.slug}
              href={`/concerns/${c.slug}`}
              className="flex items-center gap-2 py-1.5 px-2 rounded-md text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition"
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t pt-5">
        <h3 className="font-bold text-primary mb-3">Category</h3>
        <div className="space-y-1.5">
          <Link
            href="/products"
            className={`block py-1.5 px-2 rounded-md text-sm transition ${
              !categoryParam
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            All Products
          </Link>
          {Object.entries(categoryTitles).map(([slug, name]) => (
            <Link
              key={slug}
              href={`/products?category=${slug}`}
              className={`block py-1.5 px-2 rounded-md text-sm transition ${
                categoryParam === slug
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {name}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t pt-5">
        <h3 className="font-bold text-primary mb-3">Price</h3>
        <div className="space-y-1.5">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setPriceRange(range.value)}
              className={`w-full text-left py-1.5 px-2 rounded-md text-sm transition ${
                priceRange === range.value
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {(priceRange !== "all" || sortBy !== "default" || categoryParam || query) && (
        <div className="border-t pt-5">
          <Link
            href="/products"
            onClick={() => {
              setPriceRange("all");
              setSortBy("default");
            }}
            className="block text-center text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Clear All Filters
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
          {pageTitle}
        </h1>
        <p className="text-gray-600">
          {loading ? "Loading..." : `${filteredProducts.length} product(s) found`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-lg border shadow-sm p-5 sticky top-24">
            <FilterContent />
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-600 hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200"></div>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          <div className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 overflow-y-auto shadow-xl lg:hidden">
            <div className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-primary">Filters</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FilterContent />
            </div>
          </div>
        </>
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
