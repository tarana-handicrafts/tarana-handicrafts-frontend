import React from 'react';
import { Home, Building2, Briefcase, Gift, ArrowRight } from 'lucide-react';

const UseCases = () => {
  const scenarios = [
    {
      id: "01",
      category: "Home Décor",
      title: "Private Sanctuaries",
      icon: <Home size={32} strokeWidth={1} />,
      spaces: ["Living Room Showcases", "Entry Table Statements", "Wall Shelves & Corner Accents"],
      description: "Transforming residential spaces into galleries of heritage. Our elephants bring a sense of grounding and history to modern homes.",
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013"
    },
    {
      id: "02",
      category: "Interior Decoration",
      title: "Commercial Elegance",
      icon: <Building2 size={32} strokeWidth={1} />,
      spaces: ["Premium Interior Projects", "Hotel & Resort Atriums", "Traditional Theme Decor"],
      description: "Scale and sophistication for hospitality. We provide statement pieces that define the cultural identity of luxury resorts.",
      image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3"
    },
    {
      id: "03",
      category: "Office & Workspace",
      title: "Professional Power",
      icon: <Briefcase size={32} strokeWidth={1} />,
      spaces: ["Executive Desk Decor", "Reception Showcase", "Corporate Lounges"],
      description: "The elephant represents wisdom and strength—essential virtues for the workspace. A silent symbol of leadership on every desk.",
      image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88"
    },
    {
      id: "04",
      category: "Gifting",
      title: "The Art of Giving",
      icon: <Gift size={32} strokeWidth={1} />,
      spaces: ["Wedding & Housewarming", "Festival Souvenirs", "Corporate Gifting Trophies"],
      description: "Move away from generic gifts. Give a piece of Jaipur’s soul. Perfect for milestones that require a touch of royalty.",
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa"
    }
  ];

  return (
    <section className="bg-white py-24 font-sans text-stone-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header: Minimal & Strong */}
        <div className="mb-24">
          <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">Spatial Integration</span>
          <h2 className="text-5xl md:text-7xl font-serif leading-tight">
            Where Heritage <br /> 
            <span className="italic text-stone-400">Finds Its Home</span>
          </h2>
        </div>

        {/* The Unique Grid Layout */}
        <div className="grid grid-cols-1 gap-y-32">
          {scenarios.map((item, index) => (
            <div 
              key={item.id}
              className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Visual Side */}
              <div className="w-full lg:w-1/2 relative">
                <div className="aspect-[16/9] overflow-hidden bg-stone-100 rounded-sm">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                {/* Floating ID Number */}
                <span className="absolute -top-8 -left-8 text-8xl font-serif text-stone-100 -z-10 select-none">
                  {item.id}
                </span>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="flex items-center gap-4 text-[#C5A059]">
                  {item.icon}
                  <span className="h-px w-12 bg-stone-200" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-4xl font-serif italic">{item.title}</h3>
                
                <p className="text-stone-500 font-light leading-relaxed text-lg max-w-md">
                  {item.description}
                </p>

                {/* Sub-Use Cases Chips */}
                <div className="flex flex-wrap gap-3">
                  {item.spaces.map((space, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 border border-stone-100 bg-stone-50 text-[10px] uppercase tracking-widest font-bold text-stone-600 hover:border-[#C5A059] transition-colors"
                    >
                      {space}
                    </span>
                  ))}
                </div>

                <button className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black group">
                  Explore this collection 
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform text-[#C5A059]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Business Highlight */}
        <div className="mt-40 p-12 md:p-24 bg-stone-900 text-white rounded-3xl text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 italic">Have a Specific Project in Mind?</h2>
            <p className="text-stone-400 max-w-2xl mx-auto mb-10 font-light">
              From boutique hotel installations to personalized corporate gifting at scale, 
              we adapt our craftsmanship to your specific spatial requirements.
            </p>
            <button className="bg-[#C5A059] text-stone-900 px-12 py-5 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-2xl">
              Start a Custom Commission
            </button>
          </div>
          {/* Subtle watermark background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
             <span className="text-[200px] font-serif uppercase tracking-tighter">TARANA</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default UseCases;