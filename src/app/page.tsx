import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to A2Z Pharma
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Your trusted source for authentic Ayurvedic & Unani medicines. 
            Delivering wellness across India.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/products"
              className="bg-secondary hover:bg-secondary-dark text-white px-8 py-3 rounded-full font-semibold transition shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-full font-semibold transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-primary">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/products?category=male-problems"
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition text-center border-t-4 border-primary"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">💊</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary">Male Problems</h3>
              <p className="text-gray-600 text-sm">
                Ayurvedic & Unani solutions for men&apos;s health
              </p>
            </Link>

            <Link
              href="/products?category=female-problems"
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition text-center border-t-4 border-secondary"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">🌸</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-secondary">Female Problems</h3>
              <p className="text-gray-600 text-sm">
                Trusted remedies for women&apos;s wellness
              </p>
            </Link>

            <Link
              href="/products?category=general-problems"
              className="group p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition text-center border-t-4 border-green-600"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-green-700">General Problems</h3>
              <p className="text-gray-600 text-sm">
                Everyday health solutions for the whole family
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-primary">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Authentic Products</h3>
              <p className="text-gray-600">
                100% genuine Ayurvedic & Unani medicines from trusted sources.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick delivery all over India with Cash on Delivery option.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Guidance from qualified Ayurvedic & Unani experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            Need Help Choosing?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Our experts are here to help you find the right medicine for your health needs.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Talk to an Expert
          </Link>
        </div>
      </section>
    </div>
  );
}
