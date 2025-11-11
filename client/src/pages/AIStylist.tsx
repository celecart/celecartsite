import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { FashionChatbot } from "@/components/AIFeatures";

export default function AIStylist() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-2">
              <span className="text-amber-400 uppercase tracking-widest text-sm font-semibold">AI Feature</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-white mb-3">AI Stylist</h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Chat with the AI Stylist to get personalized outfit ideas, styling tips, and color palette guidance inspired by celebrity fashion.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <FashionChatbot />
          </div>
        </div>
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
}