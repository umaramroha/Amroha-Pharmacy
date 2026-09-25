"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import {
  getWhatsAppLink,
  getProductOrderMessage,
} from "@/lib/whatsapp";
import {
  getDeliveryInfo,
  validatePincode,
  getDeliveryDate,
} from "@/data/delivery";
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

type Tab =
  | "description"
  | "benefits"
  | "how-to-use"
  | "precautions";

const tabs: { key: Tab; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "benefits", label: "Benefits" },
  { key: "how-to-use", label: "How to Use" },
  { key: "precautions", label: "Precautions" },
];

const categoryLabels: Record<string, string> = {
  "male-problems": "Male Wellness",
  "female-problems": "Female Wellness",
  "general-problems": "General Wellness",
};

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] =
    useState<Tab>("description");

  const [pincode, setPincode] = useState("");
  const [deliveryCheck, setDeliveryCheck] =
    useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfo] =
    useState<any>(null);
  const [checkingPincode, setCheckingPincode] =
    useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/products/${params.slug}`
        );

        if (!res.ok) {
          setNotFound(true);
          return;
        }

        const data = await res.json();

        setProduct(data.product);

        if (data.product.category) {
          const simRes = await fetch(
            `/api/products?category=${data.product.category}`
          );

          const simData = await simRes.json();

          setSimilar(
            (simData.products || [])
              .filter(
                (p: Product) => p.id !== data.product.id
              )
              .slice(0, 4)
          );
        }
      } catch (err) {
        console.error(
          "Failed to fetch product",
          err
        );
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-10" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="aspect-square bg-gray-200 rounded-2xl" />

              <div className="space-y-5 pt-4">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-10 bg-gray-200 rounded w-4/5" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-9 h-9 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>

          <p className="text-gray-500 mb-7">
            The product you are looking for may no longer
            be available.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const mrp = product.mrp
    ? parseFloat(product.mrp)
    : parseFloat(product.price);

  const price = parseFloat(product.price);

  const discount =
    mrp > price
      ? Math.round(((mrp - price) / mrp) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price,
      image: product.image || undefined,
      quantity,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleDeliveryCheck = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      pincode.length !== 6 ||
      !/^\d+$/.test(pincode)
    ) {
      setDeliveryCheck(
        "Please enter a valid 6-digit pincode."
      );
      setDeliveryInfo(null);
      return;
    }

    setCheckingPincode(true);
    setDeliveryCheck(null);

    const validation =
      await validatePincode(pincode);

    if (!validation.valid) {
      setDeliveryCheck(
        "Invalid pincode. Please enter a valid 6-digit pincode."
      );
      setDeliveryInfo(null);
      setCheckingPincode(false);
      return;
    }

    const info = getDeliveryInfo(pincode);

    if (!info.available) {
      setDeliveryCheck(
        info.message ||
          "Delivery is not available at this pincode."
      );
      setDeliveryInfo(null);
      setCheckingPincode(false);
      return;
    }

    setDeliveryInfo({
      city: validation.city,
      state: validation.state,
      zone: info.zone,
      days: info.deliveryDays,
      fee: info.deliveryFee,
      codAvailable: info.codAvailable,
      discount: info.discount,
      offerMessage: info.offerMessage,
    });

    setDeliveryCheck(info.message || "");
    setCheckingPincode(false);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-900">

      {/* PAGE CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* BREADCRUMB */}
        <nav className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-8">
          <Link
            href="/"
            className="hover:text-primary transition"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/products"
            className="hover:text-primary transition"
          >
            Products
          </Link>

          {product.category && (
            <>
              <span>/</span>

              <Link
                href={`/products?category=${product.category}`}
                className="hover:text-primary transition"
              >
                {categoryLabels[product.category] ||
                  product.category}
              </Link>
            </>
          )}

          <span>/</span>

          <span className="text-gray-800 font-medium truncate max-w-[220px]">
            {product.name}
          </span>
        </nav>

        {/* MAIN PRODUCT */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-14">

          {/* PRODUCT IMAGE */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="aspect-square flex items-center justify-center bg-white p-5 sm:p-8">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-xl">
                  <svg
                    className="w-20 h-20 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.3}
                      d="M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 0L4 7m8 4v10"
                    />
                  </svg>

                  <p className="mt-3 text-sm text-gray-400">
                    Product image unavailable
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="flex flex-col">

            {/* CATEGORY */}
            {product.category && (
              <Link
                href={`/products?category=${product.category}`}
                className="text-xs font-bold tracking-[0.12em] uppercase text-primary mb-3"
              >
                {categoryLabels[product.category] ||
                  product.category}
              </Link>
            )}

            {/* TITLE */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-gray-900 mb-5">
              {product.name}
            </h1>

            {/* PRICE */}
            <div className="flex items-center flex-wrap gap-3 pb-5 border-b border-gray-200">
              <span className="text-3xl md:text-4xl font-bold text-primary">
                ₹{price.toLocaleString("en-IN")}
              </span>

              {product.mrp &&
                parseFloat(product.mrp) > price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹
                      {parseFloat(
                        product.mrp
                      ).toLocaleString("en-IN")}
                    </span>

                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold">
                      {discount}% OFF
                    </span>
                  </>
                )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-[15px] leading-7 text-gray-600 mt-5 mb-6">
              {product.description ||
                "Product information is currently unavailable."}
            </p>

            {/* STOCK */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  In Stock
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Out of Stock
                </div>
              )}
            </div>

            {/* QUANTITY */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Quantity
              </label>

              <div className="inline-flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    setQuantity(
                      Math.max(1, quantity - 1)
                    )
                  }
                  className="w-11 h-11 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-50 transition"
                >
                  −
                </button>

                <span className="w-12 text-center font-semibold text-gray-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    setQuantity(quantity + 1)
                  }
                  className="w-11 h-11 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-50 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="space-y-3">

              {/* ADD TO CART */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full h-12 rounded-lg font-semibold text-sm transition-all ${
                  product.stock === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : added
                    ? "bg-green-600 text-white"
                    : "bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md"
                }`}
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : added
                  ? "✓ Added to Cart"
                  : "Add to Cart"}
              </button>

              {/* WHATSAPP */}
              {product.stock > 0 && (
                <a
                  href={getWhatsAppLink(
                    getProductOrderMessage({
                      name: product.name,
                      price,
                      slug: product.slug,
                      quantity,
                    })
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-lg border border-green-600 text-green-700 bg-white hover:bg-green-50 flex items-center justify-center gap-2 font-semibold text-sm transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.198.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Order on WhatsApp
                </a>
              )}

              {/* CART LINK */}
              <Link
                href="/cart"
                className="w-full text-center text-sm font-semibold text-gray-600 hover:text-primary transition py-2"
              >
                View Cart →
              </Link>
            </div>

            {/* DELIVERY CHECK */}
            <div className="mt-7 border border-gray-200 rounded-xl bg-white p-5">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">
                  Delivery Availability
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Check delivery options for your pincode.
                </p>
              </div>

              <form
                onSubmit={handleDeliveryCheck}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) =>
                    setPincode(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="Enter 6-digit pincode"
                  className="flex-1 h-11 px-3 rounded-lg border border-gray-300 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <button
                  type="submit"
                  disabled={checkingPincode}
                  className="h-11 px-6 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition disabled:opacity-50"
                >
                  {checkingPincode
                    ? "Checking..."
                    : "Check"}
                </button>
              </form>

              {deliveryCheck &&
                !deliveryInfo && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm font-medium text-red-700">
                    {deliveryCheck}
                  </div>
                )}

              {deliveryInfo && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50/60 p-4 space-y-3">

                  {deliveryInfo.city && (
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        ✓ Delivery available
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {deliveryInfo.city},{" "}
                        {deliveryInfo.state}
                      </p>
                    </div>
                  )}

                  {deliveryInfo.days && (
                    <div className="flex justify-between gap-4 text-sm border-t border-green-100 pt-3">
                      <span className="text-gray-600">
                        Estimated delivery
                      </span>

                      <strong className="text-gray-900 text-right">
                        {getDeliveryDate(
                          deliveryInfo.days[0]
                        )}{" "}
                        –{" "}
                        {getDeliveryDate(
                          deliveryInfo.days[1]
                        )}
                      </strong>
                    </div>
                  )}

                  {deliveryInfo.fee !==
                    undefined && (
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-600">
                        Delivery fee
                      </span>

                      <strong
                        className={
                          deliveryInfo.fee === 0
                            ? "text-green-700"
                            : "text-gray-900"
                        }
                      >
                        {deliveryInfo.fee === 0
                          ? "FREE"
                          : `₹${deliveryInfo.fee}`}
                      </strong>
                    </div>
                  )}

                  {deliveryInfo.offerMessage && (
                    <p className="text-sm font-semibold text-primary pt-1">
                      {deliveryInfo.offerMessage}
                    </p>
                  )}

                  <div className="flex justify-between gap-4 text-sm border-t border-green-100 pt-3">
                    <span className="text-gray-600">
                      Cash on Delivery
                    </span>

                    <strong
                      className={
                        deliveryInfo.codAvailable
                          ? "text-green-700"
                          : "text-red-600"
                      }
                    >
                      {deliveryInfo.codAvailable
                        ? "Available"
                        : "Not Available"}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden mb-14">

          <div className="bg-white p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.291 9 11.623C17.176 19.291 21 14.591 21 9c0-.673-.055-1.332-.16-1.976z"
                />
              </svg>
            </div>

            <div>
              <p className="font-semibold text-sm">
                Secure Ordering
              </p>
              <p className="text-xs text-gray-500">
                Easy & convenient
              </p>
            </div>
          </div>

          <div className="bg-white p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <p className="font-semibold text-sm">
                UPI Payments
              </p>
              <p className="text-xs text-gray-500">
                Convenient payment
              </p>
            </div>
          </div>

          <div className="bg-white p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 7h11v10H3V7zm11 3h4l3 3v4h-7v-7zm-7 7a2 2 0 104 0m6 0a2 2 0 104 0"
                />
              </svg>
            </div>

            <div>
              <p className="font-semibold text-sm">
                Reliable Delivery
              </p>
              <p className="text-xs text-gray-500">
                Across available pincodes
              </p>
            </div>
          </div>
        </section>

        {/* PRODUCT INFORMATION */}
        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-14">

          {/* TABS */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max px-2 md:px-5">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() =>
                    setActiveTab(tab.key)
                  }
                  className={`px-4 md:px-5 py-4 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 md:p-8">

            {activeTab === "description" && (
              <div className="max-w-4xl">
                <h2 className="text-xl font-bold mb-4">
                  Product Description
                </h2>

                <p className="text-gray-600 leading-7">
                  {product.description ||
                    "Product information is currently unavailable."}
                </p>

                <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-600 leading-6">
                  Please refer to the product packaging
                  and label for complete ingredient,
                  usage and product-specific information.
                </div>
              </div>
            )}

            {activeTab === "benefits" && (
              <div className="max-w-4xl">
                <h2 className="text-xl font-bold mb-5">
                  Product Benefits
                </h2>

                <div className="space-y-4">

                  {[
                    "Product-specific formulation and intended use.",
                    "Designed for convenient everyday use as directed.",
                    "Follow the product label for detailed information.",
                    "Individual results may vary depending on the product and user.",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-1 w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </span>

                      <p className="text-gray-600 leading-6">
                        {item}
                      </p>
                    </div>
                  ))}

                </div>
              </div>
            )}

            {activeTab === "how-to-use" && (
              <div className="max-w-4xl">
                <h2 className="text-xl font-bold mb-6">
                  How to Use
                </h2>

                <div className="space-y-5">

                  {[
                    [
                      "01",
                      "Follow the Product Label",
                      "Use the product according to the dosage and directions provided on the packaging.",
                    ],
                    [
                      "02",
                      "Use as Directed",
                      "Do not exceed the recommended dosage or frequency.",
                    ],
                    [
                      "03",
                      "Need Individual Advice?",
                      "For personal dosage or medical advice, consult a qualified healthcare professional.",
                    ],
                  ].map(
                    ([number, title, text]) => (
                      <div
                        key={number}
                        className="flex gap-4"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {number}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {title}
                          </h3>

                          <p className="text-sm text-gray-600 leading-6">
                            {text}
                          </p>
                        </div>
                      </div>
                    )
                  )}

                </div>

                <div className="mt-7 p-4 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-800 leading-6">
                  <strong>Important:</strong>{" "}
                  Always follow the product label.
                  If you have a medical condition,
                  take medicines, or require
                  individual dosage advice, consult
                  a qualified healthcare professional.
                </div>
              </div>
            )}

            {activeTab === "precautions" && (
              <div className="max-w-4xl">
                <h2 className="text-xl font-bold mb-5">
                  Precautions
                </h2>

                <ul className="space-y-4 text-gray-600">

                  {[
                    "Read the product label carefully before use.",
                    "Follow the recommended dosage and directions.",
                    "Keep the product stored as recommended on the packaging.",
                    "Consult a healthcare professional if you are pregnant, breastfeeding, taking medicines, or have an existing medical condition.",
                    "Stop use and seek appropriate medical advice if an unexpected reaction occurs.",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-1 text-red-500">
                        !
                      </span>

                      <span className="leading-6">
                        {item}
                      </span>
                    </li>
                  ))}

                </ul>

                <div className="mt-7 p-4 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-600 leading-6">
                  <strong className="text-gray-800">
                    Important Information:
                  </strong>{" "}
                  Product information is provided for
                  general informational purposes and
                  does not replace professional medical
                  advice, diagnosis or treatment.
                </div>
              </div>
            )}

          </div>
        </section>

        {/* SIMILAR PRODUCTS */}
        {similar.length > 0 && (
          <section className="mb-14">

            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Explore More
                </p>

                <h2 className="text-2xl md:text-3xl font-bold">
                  Related Products
                </h2>
              </div>

              <Link
                href="/products"
                className="hidden sm:block text-sm font-semibold text-primary hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

              {similar.map((item) => {
                const itemPrice =
                  parseFloat(item.price);

                const itemMrp = item.mrp
                  ? parseFloat(item.mrp)
                  : itemPrice;

                const itemDiscount =
                  itemMrp > itemPrice
                    ? Math.round(
                        ((itemMrp - itemPrice) /
                          itemMrp) *
                          100
                      )
                    : 0;

                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="aspect-square bg-gray-50 p-4 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform"
                        />
                      ) : (
                        <svg
                          className="w-12 h-12 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.3}
                            d="M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 0L4 7m8 4v10"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="p-4">

                      <h3 className="font-semibold text-sm md:text-base text-gray-900 line-clamp-2 min-h-[42px] group-hover:text-primary transition">
                        {item.name}
                      </h3>

                      <div className="flex items-center flex-wrap gap-2 mt-3">
                        <span className="font-bold text-primary">
                          ₹
                          {itemPrice.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        {itemMrp >
                          itemPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹
                            {itemMrp.toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        )}

                        {itemDiscount > 0 && (
                          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                            {itemDiscount}% OFF
                          </span>
                        )}
                      </div>

                      <div className="mt-4 text-xs font-semibold text-gray-500 group-hover:text-primary transition">
                        View Product →
                      </div>
                    </div>
                  </Link>
                );
              })}

            </div>
          </section>
        )}

      </div>
    </main>
  );
}