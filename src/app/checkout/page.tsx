"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user, loading } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const deliveryFee = totalPrice >= 500 ? 0 : 50;
  const finalTotal = totalPrice + deliveryFee;

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!user) {
      setOrderError("Please login to place an order");
      return;
    }

    setPlacingOrder(true);
    setOrderError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerMobile: formData.mobile,
          customerEmail: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          items: items.map((i) => ({
            id: i.id,
            price: i.price,
            quantity: i.quantity,
          })),
          subtotal: totalPrice,
          deliveryFee: deliveryFee,
          total: finalTotal,
          paymentMethod: paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOrderError(data.error || "Failed to place order");
        setPlacingOrder(false);
        return;
      }

      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error("Order error:", err);
      setOrderError("Network error. Please try again.");
      setPlacingOrder(false);
    }
  };

  // Loading state
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

  // Login required
  if (!user && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Login Required
        </h1>
        <p className="text-gray-600 mb-8">
          Please login to place your order.
        </p>
        <Link
          href="/login"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition"
        >
          Login / Register
        </Link>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Your Cart is Empty
        </h1>
        <Link
          href="/products"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  // Success screen
  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for shopping with A2Z Pharma. We&apos;ll contact you soon on
          your mobile number.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/orders"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Message */}
            {orderError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {orderError}
              </div>
            )}

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 text-primary">
                1. Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 text-primary">
                2. Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary resize-none"
                    placeholder="House no, street, landmark..."
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                      placeholder="XXXXXX"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 text-primary">
                3. Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">💵 Cash on Delivery</p>
                    <p className="text-xs text-gray-500">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">📱 UPI Payment (QR Code)</p>
                    <p className="text-xs text-gray-500">
                      Scan QR code and pay instantly
                    </p>
                  </div>
                </label>

                {paymentMethod === "upi" && (
                  <div className="mt-4 p-6 bg-gray-50 rounded-lg text-center border">
                    <p className="text-sm text-gray-600 mb-4">
                      Scan this QR code to pay ₹{finalTotal}
                    </p>
                    <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <p className="text-xs text-gray-400 px-4">
                        QR Code will be added after payment integration
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      After payment, place your order below
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-primary">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">
                  ₹{finalTotal}
                </span>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="w-full mt-6 bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-semibold transition disabled:opacity-50"
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing order you agree to our Terms
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
