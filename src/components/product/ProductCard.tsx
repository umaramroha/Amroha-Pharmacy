"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string;
  mrp: string | null;
  image: string | null;
  stock?: number;
  category?: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  const price = parseFloat(product.price);
  const mrp = product.mrp ? parseFloat(product.mrp) : price;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const inWishlist = isInWishlist(product.id);
  const inStock = product.stock === undefined || product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addToCart({
      id: product.id,
      name: product.name,
      price,
      image: product.image || undefined,
      quantity: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition group">
      {/* Wishlist Heart */}
      <button
        onClick={handleWishlist}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute top-1.5 right-1.5 z-10 w-7 h-7 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition"
      >
        <svg
          className={`w-3.5 h-3.5 transition ${
            inWishlist
              ? "text-red-500 fill-red-500"
              : "text-gray-400 fill-none"
          }`}
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Discount Badge */}
      {discount > 0 && (
        <span className="absolute top-1.5 left-1.5 z-10 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
          {discount}% OFF
        </span>
      )}

      <Link href={`/products/${product.slug}`} className="block">
        {/* Image — smaller aspect */}
        <div className="aspect-square bg-white p-3 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
            />
          ) : (
            <span className="text-4xl text-gray-300">💊</span>
          )}
        </div>

        {/* Compact Info */}
        <div className="px-2.5 pb-2.5">
          <h3 className="font-medium text-[13px] text-gray-800 line-clamp-2 leading-tight min-h-[2rem] mb-1.5">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-1.5 flex-wrap mb-2">
            <span className="text-[15px] font-bold text-gray-900">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {mrp > price && (
              <span className="text-[10px] text-gray-400 line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add Button — outside Link */}
      <div className="px-2.5 pb-2.5">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`w-full h-8 rounded-md border text-[11px] font-bold tracking-wide transition ${
            !inStock
              ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
              : justAdded
              ? "bg-green-600 border-green-600 text-white"
              : "border-green-600 text-green-700 hover:bg-green-50"
          }`}
        >
          {!inStock ? "OUT OF STOCK" : justAdded ? "✓ ADDED" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}
