"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { getProductOrderMessage, getWhatsAppLink } from "@/lib/whatsapp";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number | null;
  image: string | null;
  category: string | null;
  description: string | null;
  stock: number;
};

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Product Not Found
        </h1>
        <Link
          href="/products"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full font-semibold transition"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  const mrp = product.mrp || product.price;
  const discount = Math.round(((mrp - product.price) / mrp) * 100);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || undefined,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const categoryLabels: Record<string, string> = {
    "male-problems": "Male Problems",
    "female-problems": "Female Problems",
    "general-problems": "General Problems",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-primary">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover aspect-square"
            />
          ) : (
            <div className="aspect-square flex items-center justify-center text-8xl text-gray-300 bg-gray-50">
              💊
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <span className="text-sm text-secondary font-semibold uppercase tracking-wide">
              {categoryLabels[product.category] || product.category}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-800">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">
              ₹{product.price}
            </span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  ₹{product.mrp}
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description || "No description available."}
          </p>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600 text-sm font-semibold">
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 text-sm font-semibold">
                ✗ Out of Stock
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Quantity:</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-100 font-bold"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-100 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
<div className="space-y-3">
  <div className="flex flex-col sm:flex-row gap-3">
    <button
      onClick={handleAddToCart}
      disabled={product.stock === 0}
      className={`flex-1 py-3 rounded-full font-semibold transition ${
        product.stock === 0
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : added
          ? "bg-green-600 text-white"
          : "bg-primary hover:bg-primary-dark text-white"
      }`}
    >
      {product.stock === 0
        ? "Out of Stock"
        : added
        ? "✓ Added to Cart"
        : "Add to Cart"}
    </button>
    <Link
      href="/cart"
      className="flex-1 py-3 rounded-full font-semibold text-center border-2 border-primary text-primary hover:bg-primary hover:text-white transition"
    >
      View Cart
    </Link>
  </div>

  {/* WhatsApp Order */}
  {product.stock > 0 && (
    <a
      href={getWhatsAppLink(
        getProductOrderMessage({
          name: product.name,
          price: product.price,
          slug: product.slug,
          quantity,
        })
      )}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold transition bg-green-500 hover:bg-green-600 text-white"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      Order on WhatsApp
    </a>
  )}
</div>

          {/* Delivery Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
            <p className="mb-1">
              🚚 <strong>Fast Delivery</strong> all over India
            </p>
            <p className="mb-1">
              💵 <strong>Cash on Delivery</strong> available
            </p>
            <p>
              📱 <strong>UPI Payment</strong> accepted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
