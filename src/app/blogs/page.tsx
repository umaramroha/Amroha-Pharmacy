import Link from "next/link";

const blogs = [
  {
    id: "1",
    title: "Ayurveda vs Unani Medicine: Dono Me Kya Antar Hai?",
    slug: "ayurveda-vs-unani-medicine",
    excerpt: "Natural healing ke daur me Ayurveda aur Unani dono popular hain. Jane inke basic differences, origin aur sahi chikitsa kaise chune.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800",
    date: "25 Sep 2026",
    author: "Amroha Pharmacy Team",
  },
  {
    id: "2",
    title: "Paachan Tantra Ko Mazboot Banane Ke Top 5 Herbal Nuskhe",
    slug: "digestive-health-herbal-remedies",
    excerpt: "Gas, acidity aur constipation ka permanent samadhan — Ayurvedic aur Unani herbal nuskhe jo pait ko saaf aur healthy rakhte hain.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800",
    date: "20 Sep 2026",
    author: "Amroha Pharmacy Team",
  },
  {
    id: "3",
    title: "Badalte Mausam Me Immunity Badhane Ke Best Aushadhiya",
    slug: "immunity-boosters-ayurveda-unani",
    excerpt: "Seasonal diseases aur viral infections se bachne ke liye Ayurveda aur Unani ke powerful immunity boosters — Chyawanprash, Khamira Marwareed aur more.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800",
    date: "15 Sep 2026",
    author: "Amroha Pharmacy Team",
  },
  {
    id: "4",
    title: "Jodo Ke Dard Aur Stiffness Se Rahat: Natural Oil & Herbs",
    slug: "joint-pain-natural-relief",
    excerpt: "Arthritis aur joint pain ka natural ilaaj — Mahanarayan Oil, Shallaki aur Majoon Suranjan jaise proven herbal formulations.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800",
    date: "10 Sep 2026",
    author: "Amroha Pharmacy Team",
  },
];

export default function BlogsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-primary">
          Our Blog
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Health tips, Ayurvedic wisdom, and Unani medicine insights from our experts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.slug}`}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border group"
          >
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                <span>📅 {blog.date}</span>
                <span>✍️ {blog.author}</span>
              </div>
              <h2 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-primary transition line-clamp-2">
                {blog.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {blog.excerpt}
              </p>
              <span className="text-primary font-semibold text-sm">
                Read More →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
