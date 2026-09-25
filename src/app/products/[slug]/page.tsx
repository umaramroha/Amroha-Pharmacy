"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { getWhatsAppLink, getProductOrderMessage } from "@/lib/whatsapp";
import {
  getDeliveryInfo,
  validatePincode,
  getDeliveryDate,
} from "@/data/delivery";

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

type Tab = "description" | "benefits" | "how-to-use" | "precautions";

const tabs: { key: Tab; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "benefits", label: "Benefits" },
  { key: "how-to-use", label: "How to Use" },
  { key: "precautions", label: "Precautions" },
];

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
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [pincode, setPincode] = useState("");
  const [deliveryCheck, setDeliveryCheck] = useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);
  const [checkingPincode, setCheckingPincode] = useState(false);
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

        if (data.product.category) {
          const simRes = await fetch(
            `/api/products?category=${data.product.category}`
          );
          const simData = await simRes.json();
          setSimilar(
            (simData.products || [])
              .filter((p: Product) => p.id !== data.product.id)
              .slice(0, 4)
          );
        }
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
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
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

  const mrp = product.mrp ? parseFloat(product.mrp) : parseFloat(product.price);
  const price = parseFloat(product.price);
  const discount = Math.round(((mrp - price) / mrp) * 100);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image || undefined,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDeliveryCheck = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setDeliveryCheck("❌ Please enter a valid 6-digit pincode");
      setDeliveryInfo(null);
      return;
    }

    setCheckingPincode(true);
    setDeliveryCheck(null);

    const validation = await validatePincode(pincode);

    if (!validation.valid) {
      setDeliveryCheck(
        "❌ Invalid pincode. Kripya sahi 6-digit pincode daalein."
      );
      setDeliveryInfo(null);
      setCheckingPincode(false);
      return;
    }

    const info = getDeliveryInfo(pincode);

    if (!info.available) {
      setDeliveryCheck(`❌ ${info.message}`);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
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
            <Link
              href={`/products?category=${product.category}`}
              className="text-sm text-secondary font-semibold uppercase tracking-wide hover:underline"
            >
              {categoryLabels[product.category] || product.category}
            </Link>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-800">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-3xl font-bold text-primary">₹{price}</span>
            {product.mrp && parseFloat(product.mrp) > price && (
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

            {product.stock > 0 && (
              <a
                href={getWhatsAppLink(
                  getProductOrderMessage({
                    name: product.name,
                    price: price,
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

          {/* Delivery Check */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <p className="text-sm font-semibold mb-3 text-gray-700">
              🚚 Check Delivery
            </p>
            <form onSubmit={handleDeliveryCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) =>
                  setPincode(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter 6-digit pincode"
                className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={checkingPincode}
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-md text-sm font-semibold transition disabled:opacity-50"
              >
                {checkingPincode ? "..." : "Check"}
              </button>
            </form>

            {deliveryCheck && !deliveryInfo && (
              <p className="text-sm mt-3 font-medium text-red-600">
                {deliveryCheck}
              </p>
            )}

            {deliveryInfo && (
              <div className="mt-4 p-3 bg-white rounded-md border border-green-200 space-y-2 text-sm">
                {deliveryInfo.city && (
                  <p className="text-green-700 font-semibold">
                    📍 {deliveryInfo.city}, {deliveryInfo.state}
                  </p>
                )}
                {deliveryInfo.days && (
                  <p className="text-gray-700">
                    🚚 Delivery:{" "}
                    <strong>
                      {getDeliveryDate(deliveryInfo.days[0])} -{" "}
                      {getDeliveryDate(deliveryInfo.days[1])}
                    </strong>
                  </p>
                )}
                {deliveryInfo.fee !== undefined && (
                  <p className="text-gray-700">
                    💰 Delivery Fee:{" "}
                    {deliveryInfo.fee === 0 ? (
                      <strong className="text-green-600">FREE</strong>
                    ) : (
                      <strong>₹{deliveryInfo.fee}</strong>
                    )}
                  </p>
                )}
                {deliveryInfo.offerMessage && (
                  <p className="text-secondary font-semibold">
                    {deliveryInfo.offerMessage}
                  </p>
                )}
                <p
                  className={`font-semibold ${
                    deliveryInfo.codAvailable
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {deliveryInfo.codAvailable
                    ? "✅ COD Available"
                    : "⚠️ COD available nahi hai. Sirf UPI Payment"}
                </p>
              </div>
            )}
          </div>

          {/* Delivery Info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
            <p className="mb-1">
              💵 <strong>Cash on Delivery</strong> available (select pincodes)
            </p>
            <p className="mb-1">
              📱 <strong>UPI Payment</strong> accepted
            </p>
            <p>
              🚚 <strong>Free Delivery</strong> on orders above ₹500 (UP)
            </p>
          </div>
        </div>
      </div>

      {/* Product Info Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-12">
        <div className="border-b overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 md:px-6 py-4 text-sm font-semibold whitespace-nowrap transition border-b-2 ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "description" && (
            <div className="text-gray-700 leading-relaxed">
              <p>{product.description || "No description available."}</p>
              <p className="mt-4 text-sm text-gray-500">
                Ye product authentic Ayurvedic aur Unani ingredients se bana
                hai. Traditional formulation hai jo generations se use hoti
                aayi hai.
              </p>
            </div>
          )}

          {activeTab === "benefits" && (
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-lg mt-0.5">✓</span>
                <span>100% natural aur authentic herbal ingredients</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-lg mt-0.5">✓</span>
                <span>Traditional Ayurvedic aur Unani formulation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-lg mt-0.5">✓</span>
                <span>Koi harsh chemical ya side-effect nahi</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-lg mt-0.5">✓</span>
                <span>Regular use se better results</span>
              </li>
            </ul>
          )}

          {activeTab === "how-to-use" && (
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  1
                </span>
                <div>
                  <p className="font-semibold">Dosage</p>
                  <p className="text-sm text-gray-600">
                    Din me 1-2 baar, khane ke baad paani ya doodh ke saath lein.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  2
                </span>
                <div>
                  <p className="font-semibold">Time</p>
                  <p className="text-sm text-gray-600">
                    Best results ke liye subah aur raat ko regular lein.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  3
                </span>
                <div>
                  <p className="font-semibold">Duration</p>
                  <p className="text-sm text-gray-600">
                    Minimum 1-2 mahine regular lein, results person-to-person
                    vary karte hain.
                  </p>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <strong>Note:</strong> Doctor se consult karke hi exact dosage
                lein.
              </div>
            </div>
          )}

          {activeTab === "precautions" && (
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5">⚠</span>
                <span>
                  Pregnancy ya breastfeeding ke dauran doctor se puchhein
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5">⚠</span>
                <span>Kisi ingredient se allergy ho toh use na karein</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5">⚠</span>
                <span>
                  Prescribed medicines ke saath lene se pehle doctor se puchhein
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5">⚠</span>
                <span>Bachchon ki pahunch se door rakhein</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5">⚠</span>
                <span>
                  Kisi bhi side-effect pe turant band karein aur doctor se
                  milein
                </span>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
            Similar Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {similar.map((p) => {
              const simMrp = p.mrp ? parseFloat(p.mrp) : parseFloat(p.price);
              const simPrice = parseFloat(p.price);
              const simDiscount = Math.round(
                ((simMrp - simPrice) / simMrp) * 100
              );

              return (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border group"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                        💊
                      </div>
                    )}
                    {simDiscount > 0 && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {simDiscount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        ₹{p.price}
                      </span>
                      {p.mrp && parseFloat(p.mrp) > simPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{p.mrp}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
