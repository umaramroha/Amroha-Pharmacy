import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">About Amroha Pharmacy</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Authentic Ayurvedic & Unani medicines, trusted by families across India
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-primary text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Amroha Pharmacy was founded with a simple mission — to make authentic Ayurvedic and Unani medicines easily accessible to every Indian household. Based in Amroha, Uttar Pradesh, we have been serving our community with genuine, high-quality traditional medicines.
            </p>
            <p>
              We believe that nature has the power to heal, and our ancestors&apos; wisdom in Ayurveda and Unani systems of medicine holds the key to holistic wellness. Every product we sell is carefully sourced from trusted manufacturers and traditional practitioners.
            </p>
            <p>
              From tablets, capsules, and pills to Majoon and Safoof — we offer a complete range of remedies for male problems, female problems, and general health issues.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-primary/5 rounded-lg border-l-4 border-primary">
              <h3 className="text-2xl font-bold mb-3 text-primary">🎯 Our Mission</h3>
              <p className="text-gray-700">
                To provide 100% authentic Ayurvedic and Unani medicines at affordable prices, delivering wellness to every home across India.
              </p>
            </div>
            <div className="p-6 bg-secondary/5 rounded-lg border-l-4 border-secondary">
              <h3 className="text-2xl font-bold mb-3 text-secondary">👁 Our Vision</h3>
              <p className="text-gray-700">
                To become India&apos;s most trusted online destination for traditional medicine, preserving ancient wisdom for modern health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border-t-4 border-primary">
              <p className="text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-gray-600 text-sm">Happy Customers</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border-t-4 border-secondary">
              <p className="text-4xl font-bold text-secondary mb-2">100+</p>
              <p className="text-gray-600 text-sm">Products</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border-t-4 border-green-600">
              <p className="text-4xl font-bold text-green-600 mb-2">100%</p>
              <p className="text-gray-600 text-sm">Authentic</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border-t-4 border-primary">
              <p className="text-4xl font-bold text-primary mb-2">All India</p>
              <p className="text-gray-600 text-sm">Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-10 text-center text-primary">
            Why Choose Amroha Pharmacy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Genuine Products</h3>
                <p className="text-gray-600 text-sm">
                  Sourced from trusted manufacturers and traditional practitioners.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Affordable Prices</h3>
                <p className="text-gray-600 text-sm">
                  Best prices with regular discounts and offers.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">
                  Quick delivery across India with COD available.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xl">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Expert Guidance</h3>
                <p className="text-gray-600 text-sm">
                  Free consultation from qualified Ayurvedic & Unani experts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
            Ready to Start Your Wellness Journey?
          </h2>
          <Link
            href="/products"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
}
