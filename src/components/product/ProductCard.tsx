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

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [justAdded, setJustAdded] = useState(false);

  const price = parseFloat(product.price);
  const mrp = product.mrp ? parseFloat(product.mrp) : price;

  const discount =
    mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const inWishlist = isInWishlist(product.id);
  const inStock = product.stock === undefined || product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;

    addToCart({
      id: product.id,
      name: product.name,
      price,
      image: product.image || undefined,
      quantity: 1,
    });

    setJustAdded(true);

    setTimeout(() => {
      setJustAdded(false);
    }, 1500);
  };

  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product.id);
  };

  return (
    <article className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-lg">
      {/* Wishlist */}
      <button
        type="button"
        onClick={handleWishlist}
        aria-label={
          inWishlist
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        aria-pressed={inWishlist}
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:scale-105 hover:border-gray-300"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-[18px] w-[18px] transition-colors ${
            inWishlist
              ? "fill-red-500 text-red-500"
              : "fill-none text-gray-500"
          }`}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
          />
        </svg>
      </button>

      {/* Discount */}
      {discount > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded bg-green-600 px-2 py-1 text-[10px] font-bold tracking-wide text-white">
          {discount}% OFF
        </span>
      )}

      {/* Product Link */}
      <Link
        href={`/products/${product.slug}`}
        className="block"
        aria-label={`View ${product.name}`}
      >
        {/* Product Image */}
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-50 p-5">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="h-14 w-14 text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 5 2-2h2l2 2m-8 0h10m-11 0a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 11h8M8 15h5"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
              {product.category}
            </p>
          )}

          {/* Name */}
          <h3 className="mb-3 min-h-[42px] line-clamp-2 text-sm font-semibold leading-5 text-gray-800">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{price.toLocaleString("en-IN")}
            </span>

            {mrp > price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Stock */}
          <p
            className={`mt-2 text-[11px] font-medium ${
              inStock ? "text-green-600" : "text-red-500"
            }`}
          >
            {inStock ? "In stock" : "Currently unavailable"}
          </p>
        </div>
      </Link>

      {/* Add To Cart */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`flex h-10 w-full items-center justify-center rounded-lg border text-xs font-semibold tracking-wide transition-all ${
            !inStock
              ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
              : justAdded
              ? "border-green-600 bg-green-600 text-white"
              : "border-green-600 bg-white text-green-700 hover:bg-green-50"
          }`}
        >
          {!inStock
            ? "OUT OF STOCK"
            : justAdded
            ? "✓ ADDED TO CART"
            : "ADD TO CART"}
        </button>
      </div>
    </article>
  );
}
