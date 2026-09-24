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
              Your trusted source for authentic Ayurvedic & Unani medicines in Amroha. Delivering wellness across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-secondary transition">Home</Link></li>
              <li><Link href="/products" className="hover:text-secondary transition">Products</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition">About Us</Link></li>
              <li><Link href="/blogs" className="hover:text-secondary transition">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=male-problems" className="hover:text-secondary transition">Male Problems</Link></li>
              <li><Link href="/products?category=female-problems" className="hover:text-secondary transition">Female Problems</Link></li>
              <li><Link href="/products?category=general-problems" className="hover:text-secondary transition">General Problems</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>📍 Amroha, Uttar Pradesh, India</li>
              <li>📞 +918410127168</li>
              <li>✉️ your@email.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Amroha Pharmacy, Amroha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
