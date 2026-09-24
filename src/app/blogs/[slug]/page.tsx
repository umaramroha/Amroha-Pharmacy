import Link from "next/link";
import { notFound } from "next/navigation";

const blogs: Record<string, any> = {
  "ayurveda-vs-unani-medicine": {
    title: "Ayurveda vs Unani Medicine: Dono Me Kya Antar Hai Aur Sahi Chikitsa Kaise Chune?",
    date: "25 Sep 2026",
    author: "Amroha Pharmacy Team",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1200",
    content: `Aaj kal natural healing aur holistic health ka daur hai. Jab bhi herbal ilaaj ki baat aati hai, do sabse purani aur bharosemand padhatiya Ayurveda aur Unani samne aati hain. Dono hi ilaj bina kisi side-effect ke bimari ko jad se khatam karne par zor dete hain, lekin inki buniyad alag hai.

MAIN DIFFERENCES

📌 Prakriti / Siddhant
• Ayurveda: Tridosha (Vata, Pitta, Kapha) par aadharit
• Unani: Akhlaat / Humors (Dam, Balgham, Safra, Sauda) par aadharit

📌 Origin
• Ayurveda: Prachin Bharat (Ancient India)
• Unani: Prachin Unan (Greece) aur Arab civilization

📌 Main Herbs
• Ayurveda: Ashwagandha, Tulsi, Giloy, Shatavari
• Unani: Unnab, Zafran, Khamira, Majoon, Mastagi

📌 Target Approach
• Ayurveda: Dosha ko balance karke rog door karna
• Unani: Akhlaat ko balance karke Akhlat-e-Raddiya ko bahar nikalna

Dono hi padhatiya sharir ki Immunity aur self-healing capacity ko badhati hain. Aapki prakriti aur bimari ke hisab se expert practitioner inka chunaav karte hain.

A2Z Pharma pe aapko dono padhatiyo ki authentic medicines milti hain — chahe Ayurvedic Capsule ho ya Unani Majoon. Koi bhi confusion ho toh humein WhatsApp pe puchh sakte ho.`,
  },
  "digestive-health-herbal-remedies": {
    title: "Paachan Tantra Ko Mazboot Banane Ke Top 5 Herbal Nuskhe (Ayurvedic & Unani Guide)",
    date: "20 Sep 2026",
    author: "Amroha Pharmacy Team",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200",
    content: `Modern lifestyle, irregular diet aur fast food ke karan gas, acidity aur constipation aam samsya ban chuki hai. Herbal pharmacy me iska permanent aur aasan samadhan maujood hai:

1️⃣ TRIPHALA CHURNA (Ayurvedic)
Amla, Haritaki aur Bibhitaki ka ye mishran bowel movement ko regular banata hai aur pait ko saaf rakhta hai.

2️⃣ SAFOOF KATIRA & SAUNF (Unani)
Pait ki garmi aur acidity ko turant thanda karne ke liye Saunf aur Unani Safoof formulations behad kargar hain.

3️⃣ JEERA & AJWAIN KWATH
Pait ke afare (bloating) aur indigestion ko kam karne ke liye iska kada pina faydemand hota hai.

4️⃣ ISABGOL HUSK
Kabz (constipation) se raahat ke liye ye sabse safe aur natural fiber source hai.

5️⃣ HINGWASHTAK CHURNA
Khana pachane aur bhookh badhane me madadgar.

In sab herbal remedies ke liye A2Z Pharma pe visit karo ya WhatsApp pe order kar do. Ghar baithe authentic medicines milegi.`,
  },
  "immunity-boosters-ayurveda-unani": {
    title: "Badalte Mausam Me Immunity Badhane Ke Liye Best Ayurvedic & Unani Aushadhiya",
    date: "15 Sep 2026",
    author: "Amroha Pharmacy Team",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200",
    content: `Viral infections aur seasonal diseases se bachne ke liye sharir ka Immune System strong hona zaroori hai. Prachin Unani aur Ayurvedic rasayan isme behad kargar hain:

🌟 CHYAWANPRASH (Ayurveda)
Amla, Ashwagandha aur 40+ jadi-bootiyo se bana ye rasayan har umar ke logo ke liye ek behtareen tonic hai.

🌟 KHAMIRA MARWAREED (Unani)
Dil aur dimaag ko takat dene aur seasonal fevers se recovery ke liye Unani ka ek prasiddh formulation.

🌟 GILOY GHANVATI / SAT-GILOY
Blood purify karta hai aur sharir ke natural defence mechanism ko boost karta hai.

🌟 TULSI & DALCHINI TEA
Natural antioxidant properties se bharpoor jo cough aur cold se bachat karti hain.

A2Z Pharma pe ye sab authentic products available hain. Immunity strong rakho, bimaari se door raho.`,
  },
  "joint-pain-natural-relief": {
    title: "Jodo Ke Dard Aur Stiffness Se Rahat: Natural Oil Aur Herbal Formulations",
    date: "10 Sep 2026",
    author: "Amroha Pharmacy Team",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200",
    content: `Umar badhne ke sath ya physical inactivity ki wajah se jodo me dard (joint pain) aur stiffness aam baat hai. Synthetic painkillers ke bajaye natural herbs aur tailam (oils) ziada safe aur long-lasting relief dete hain:

🌿 MAHANARAYAN OIL & RUMI MASTAGI OIL
In oils se daily halki massage karne se blood circulation badhta hai aur joints ki stiffness kam hoti hai.

🌿 SHALLAKI (Boswellia Serrata)
Arthritis aur inflammation (sojan) ko kam karne me scientifically proven herbal extract hai.

🌿 ASHWAGANDHA & MUSLI
Muscular strength aur stamina ko maintain rakhne me madad karte hain.

🌿 MAJOON SURANJAN (Unani)
Joint pain, gout aur uric acid ki samsya me Unani padhati ka ek prasiddh nuskha.

A2Z Pharma pe ye sab available hain. WhatsApp pe direct order kar sakte ho.`,
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = blogs[params.slug];
  if (!blog) return { title: "Blog Not Found" };
  return {
    title: blog.title,
    description: blog.content.slice(0, 150),
  };
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = blogs[params.slug];

  if (!blog) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/blogs"
        className="text-sm text-primary hover:underline mb-6 inline-block"
      >
        ← Back to Blogs
      </Link>

      <div className="rounded-lg overflow-hidden mb-6">
        <img src={blog.image} alt={blog.title} className="w-full h-auto" />
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span>📅 {blog.date}</span>
        <span>✍️ {blog.author}</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary leading-tight">
        {blog.title}
      </h1>

      <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
        {blog.content}
      </div>

      <div className="mt-10 pt-6 border-t">
        <p className="text-gray-600 mb-4">
          Is article ke baare me koi sawaal? Ya order karna hai?
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/products"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold transition"
          >
            Shop Products
          </Link>
          <Link
            href="/contact"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-full font-semibold transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </article>
  );
}
