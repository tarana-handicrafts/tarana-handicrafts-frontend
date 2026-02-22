"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, productsData } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Search, ArrowRight, ShoppingBag, Check } from "lucide-react";

const categories = ["All", ...new Set(productsData.map((p) => p.category))];

export default function ProductsPage() {
  const { addToCart, cart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    let products = [...productsData];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(query));
    }
    if (selectedCategory !== "All") {
      products = products.filter((p) => p.category === selectedCategory);
    }
    return products;
  }, [selectedCategory, searchQuery]);

  const isInCart = (productId: number) => cart.some((item) => item.id === productId);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#000000]">
      {/* --- HERO HEADER --- */}
      <header className="px-6 pt-32 pb-16 md:px-12 border-b border-stone-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059] mb-4">
              Collections Archive
            </p>
            <h1 className="font-serif text-6xl md:text-8xl leading-none">
              The <span className="italic text-stone-300 font-light">Curated</span> <br /> Selection
            </h1>
          </div>
          <div className="relative w-full md:w-80 group">
            <input
              type="text"
              placeholder="SEARCH PIECES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-[#000000] py-3 text-[10px] font-bold tracking-widest outline-none transition-colors focus:border-[#C5A059]"
            />
            <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-[#000000]" />
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* --- VERTICAL NAVIGATION --- */}
          <aside className="lg:w-48 lg:sticky lg:top-32 h-fit space-y-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-[#C5A059]">Art Category</p>
              <ul className="space-y-4">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:pl-2 ${
                        selectedCategory === cat ? "text-[#000000] pl-2 border-l-2 border-[#C5A059]" : "text-stone-300 hover:text-black"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="hidden lg:block pt-12 border-t border-stone-100">
              <p className="text-[9px] text-stone-400 leading-relaxed uppercase tracking-[0.2em]">
                Authentic Jaipur Craftsmanship. <br /> Worldwide Secure Export.
              </p>
            </div>
          </aside>

          {/* --- ASYMMETRIC WATERFALL GRID --- */}
          <main className="flex-1">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`break-inside-avoid mb-10 group relative ${
                    index % 3 === 1 ? "md:mt-16" : "" 
                  }`}
                >
                  <div className="relative overflow-hidden bg-stone-100">
                    <Link href={`/products/${product.id}`} className="block">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={600}
                        height={index % 2 === 0 ? 800 : 600}
                        className="w-full h-auto object-cover transition-all duration-1000 group-hover:scale-110"
                      />
                    </Link>
                    
                    {/* --- REFINED HOVER UI --- */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                      <div className="flex w-full border-t border-stone-100">
                        {/* Add to Cart Side */}
                        <button
                          onClick={() => addToCart(product)}
                          disabled={isInCart(product.id)}
                          className={`flex-[1.5] py-5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                            isInCart(product.id) 
                            ? "bg-stone-100 text-stone-400 cursor-default" 
                            : "bg-white text-black hover:bg-black hover:text-white"
                          }`}
                        >
                          {isInCart(product.id) ? (
                            <><Check size={14} /> In Cart</>
                          ) : (
                            <><ShoppingBag size={14} /> Add to Cart</>
                          )}
                        </button>
                        
                        {/* View Side */}
                        <Link 
                          href={`/products/${product.id}`}
                          className="flex-1 py-5 bg-[#C5A059] text-white flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#A68648] transition-colors"
                        >
                          View <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>

                    {/* Quick Badge */}
                    {product.tag && (
                      <div className="absolute top-4 left-4 z-10">
                         <span className="bg-black text-white text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1.5">
                           {product.tag}
                         </span>
                      </div>
                    )}
                  </div>

                  {/* Product Metadata */}
                  <div className="mt-6 flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl group-hover:text-[#C5A059] transition-colors duration-500">
                        {product.name}
                      </h3>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400">
                        {product.material} • {product.category}
                      </p>
                    </div>
                    <p className="font-serif text-xl font-medium">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}