import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { concerns, getConcernBySlug } from "@/data/concerns";
import { getWhatsAppLink, getContactMessage } from "@/lib/whatsapp";

export async function generateStaticParams() {
  return concerns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const concern = getConcernBySlug(params.slug);
  if (!concern) return { title: "Concern Not Found" };
  return {
    title: `${concern.name} - Amroha Pharmacy`,
    description: concern.description,
  };
}

export default async function ConcernDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const concern = getConcernBySlug(params.slug);

  if (!concern) {
    notFound();
  }

  // Fetch related products
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { in: concern.relatedCategories },
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/concerns" className="hover:text-primary">
          Concerns
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{concern.name}</span>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-8 md:p-12 mb-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <span className="text-5xl md:text-6xl">{concern.icon}</span>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm opacity-90 mb-1">{concern.hindiName}</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {concern.name}
            </h1>
            <p className="text-sm md:text-base opacity-90 max-w-2xl">
              {concern.description}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Recommended Products
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <Link
            href="/products"
            className="text-primary font-semibold hover:underline text-sm whitespace-nowrap"
          >
            View All →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2 text-gray-700">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              Is concern ke liye abhi products available nahi hain.
            </p>
            <a
              href={getWhatsAppLink(getContactMessage(concern.name))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-semibold transition"
            >
              💬 WhatsApp pe Puchhein
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
              const mrp = product.mrp
                ? Number(product.mrp)
                : Number(product.price);
              const price = Number(product.price);
              const discount = Math.round(((mrp - price) / mrp) * 100);

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border group"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                        💊
                      </div>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        ₹{product.price.toString()}
                      </span>
                      {product.mrp && Number(product.mrp) > price && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.mrp.toString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Other Concerns */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-primary">
          Aur Concerns Dekhein
        </h2>
        <div className="flex flex-wrap gap-2">
          {concerns
            .filter((c) => c.slug !== concern.slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/concerns/${c.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-sm font-medium transition"
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </Link>
            ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary/5 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold mb-2 text-primary">
          Guidance Chahiye?
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Is concern ke baare me koi sawaal? WhatsApp pe expert se puchhein.
        </p>
        <a
          href={getWhatsAppLink(getContactMessage(concern.name))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-semibold transition"
        >
          💬 Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
