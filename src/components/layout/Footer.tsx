import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Amroha Pharmacy</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Your trusted source for authentic Ayurvedic & Unani medicines in
              Amroha. Delivering wellness across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-secondary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-secondary transition"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/concerns"
                  className="hover:text-secondary transition"
                >
                  Shop by Concern
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-secondary transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-secondary transition"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products?category=male-problems"
                  className="hover:text-secondary transition"
                >
                  Male Wellness
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=female-problems"
                  className="hover:text-secondary transition"
                >
                  Female Wellness
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=general-problems"
                  className="hover:text-secondary transition"
                >
                  General Wellness
                </Link>
              </li>
            </ul>

            <h3 className="text-lg font-bold mb-4 mt-6">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/policies/privacy"
                  className="hover:text-secondary transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/terms"
                  className="hover:text-secondary transition"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/shipping"
                  className="hover:text-secondary transition"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/returns"
                  className="hover:text-secondary transition"
                >
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/disclaimer"
                  className="hover:text-secondary transition"
                >
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>📍 Mohalla Nal, Amroha, Uttar Pradesh, India</li>
              <li>
                📞{" "}
                <a
                  href="tel:+918077988509"
                  className="hover:text-secondary transition"
                >
                  +91 80779 88509
                </a>
              </li>
              <li>
                ✉️{" "}
                <a
                  href="mailto:Amrohapharmastore@gmail.com"
                  className="hover:text-secondary transition break-all"
                >
                  Amrohapharmastore@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-90">
          <p>
            &copy; {new Date().getFullYear()} Amroha Pharmacy, Amroha. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
