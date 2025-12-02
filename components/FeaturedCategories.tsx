"use client";

// 1. Updated imports: Added 'Monitor' and 'Music'
import { Watch, Speaker, Headphones, Battery, Monitor, Music } from "lucide-react";

const FEATURES = [
  { 
    id: 1, 
    title: "SMART WATCHES", 
    icon: <Watch size={60} />, 
    color: "text-[#393E46]" 
  },
  { 
    id: 2, 
    title: "SPEAKER & SUB", 
    icon: <Speaker size={60} />, 
    color: "text-[#00ADB5]" 
  },
  { 
    id: 3, 
    title: "EARBUDS", 
    // Changed to Music icon to distinguish from Headsets
    icon: <Music size={60} />, 
    color: "text-[#393E46]" 
  },
  { 
    id: 4, 
    title: "POWERBANK", 
    icon: <Battery size={60} />, 
    color: "text-[#00ADB5]" 
  },
  { 
    id: 5, 
    title: "CREATOR GEAR", 
    // Changed to Monitor to represent PC Setup/Decoration
    icon: <Monitor size={60} />, 
    color: "text-[#393E46]" 
  },
  { 
    id: 6, 
    title: "HEADPHONES", 
    // Kept original Headphones icon (Over-ear style)
    icon: <Headphones size={60} />, 
    color: "text-[#00ADB5]" 
  },
];

const FeaturedCategories = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((item) => (
          <div 
            key={item.id} 
            className="group relative bg-[#EEEEEE] p-6 flex items-center justify-between cursor-pointer overflow-hidden rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Image/Icon Wrapper with Zoom Effect */}
            <div className="z-10 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6">
              <div className={`${item.color} drop-shadow-sm transition-colors group-hover:text-[#222831]`}>{item.icon}</div>
            </div>

            {/* Text Content */}
            <div className="z-10 text-right">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Any Type Of</p>
              <h3 className="text-xl font-black text-[#222831] uppercase leading-tight mb-3 w-32 ml-auto">
                {item.title}
              </h3>
              <span className="bg-[#00ADB5] text-white text-[10px] font-bold px-3 py-1 uppercase rounded-full inline-block group-hover:bg-[#222831] transition-colors shadow-sm">
                Shop Now
              </span>
            </div>
            
            {/* White overlay on hover */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;