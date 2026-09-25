import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { concerns, getConcernBySlug } from "@/data/concerns";
import { getWhatsAppLink, getContactMessage } from "@/lib/whatsapp";
import ProductCard from "@/components/product/ProductCard";

export async function generateStaticParams() {
  return concerns.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const concern = getConcernBySlug(params.slug);

  if (!concern) {
    return {
      title: "Concern Not Found | Amroha Pharmacy",
    };
  }

  return {
    title: `${concern.name} | Ayurvedic & Unani Care | Amroha Pharmacy`,
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

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        in: concern.relatedCategories,
      },
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price.toString(),
    mrp: p.mrp ? p.mrp.toString() : null,
    image: p.image,
    stock: p.stock,
  }));

  const whatsappLink = getWhatsAppLink(
    getContactMessage(concern.name)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm"
        >
          <Link
            href="/"
            className="text-gray-500 transition hover:text-primary"
          >
            Home
          </Link>

          <span className="text-gray-300">/</span>

          <Link
            href="/concerns"
            className="text-gray-500 transition hover:text-primary"
          >
            Concerns
          </Link>

          <span className="text-gray-300">/</span>

          <span className="font-medium text-gray-800">
            {concern.name}
          </span>
        </nav>

        {/* Hero */}
        <section className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid items-center md:grid-cols-[180px_1fr]">

            {/* Concern Icon */}
            <div className="flex h-40 items-center justify-center border-b border-gray-100 bg-gray-50 md:h-full md:border-b-0 md:border-r">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-gray-200 bg-white text-5xl shadow-sm">
                {concern.icon}
              </div>
            </div>

            {/* Hero Content */}
            <div className="p-6 text-center sm:p-8 md:p-10 md:text-left">
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
                {concern.hindiName}
              </p>

              <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {concern.name}
              </h1>

              <p className="max-w-3xl text-sm leading-6 text-gray-600 sm:text-base">
                {concern.description}
              </p>
            </div>
          </div>
        </section>

        {/* Products Header */}
        <section className="mb-10">
          <div className="mb-6 flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Shop by Concern
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Products for {concern.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {products.length} product
                {products.length !== 1 ? "s" : ""} available
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center text-sm font-semibold text-primary transition hover:text-primary-dark"
            >
              View all products
              <span className="ml-1">→</span>
            </Link>
          </div>

          {/* Products */}
          {products.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path
                    strokeLinecap="round"
                    d="m20 20-4-4"
                  />
                </svg>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                No products available
