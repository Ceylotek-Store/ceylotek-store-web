"use client";

import { useState, useEffect } from "react";
// Import Next.js optimized Image component
import Image from "next/image";
import { Circle } from "lucide-react";

// --- UPDATE SLIDE DATA HERE ---
const SLIDES = [
  {
    id: 1,
    // Path relative to the 'public' folder
    image: "/banners/banner-1.png", 
    title: "IMMERSIVE AUDIO",
    subtitle: "PREMIUM NOISE-CANCELLING HEADSETS",
  },
  {
    id: 2,
    image: "/banners/banner-2.png",
    title: "TRUE WIRELESS FREEDOM",
    subtitle: "CRYSTAL CLEAR SOUND, ANYWHERE",
  },
  {
    id: 3,
    image: "/banners/banner-3.png",
    title: "BRING THE PARTY HOME",
    subtitle: "POWERFUL PORTABLE SPEAKERS",
  },
  {
    id: 4,
    image: "/banners/banner-4.png",
    title: "POWER UP IN MINUTES",
    subtitle: "HIGH-SPEED CHARGING SOLUTIONS",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide logic (every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-0">
      {/* Slider Container: Fixed height, rounded corners, shadow */}
      <div className="relative w-full h-[300px] md:h-[480px] rounded-lg overflow-hidden shadow-lg bg-gray-900">
        
        {/* Slider Track which moves left/right */}
        <div 
          className="w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES.map((slide, index) => (
            <div key={slide.id} className="relative w-full h-full flex-shrink-0 flex items-center justify-center">
              
              {/* 1. THE IMAGE (Next/Image for optimization) */}
              {/* 'fill' makes it cover the container. 'object-cover' prevents stretching. */}
              <Image 
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                // Priority loads the first image faster for better LCP score
                priority={index === 0}
              />

              {/* 2. THE DARK OVERLAY (Crucial for text readability) */}
              {/* Adds a 50% transparent black layer on top of the image */}
              <div className="absolute inset-0 bg-black/50 z-10"></div>

              {/* 3. THE TEXT CONTENT (Sits on top of overlay) */}
              <div className="relative z-20 text-center text-white px-4 drop-shadow-lg">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-lg font-medium tracking-widest opacity-95 uppercase">
                  {slide.subtitle}
                </p>
                <button className="mt-8 border-2 border-white text-white px-8 py-2.5 text-sm font-bold uppercase hover:bg-white hover:text-[#222831] transition-colors rounded-full">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              // Active dot is solid white and larger, inactive is semi-transparent
              className={`transition-all duration-300 ${current === idx ? "text-white scale-125" : "text-white/50 hover:text-white"}`}
            >
              <Circle size={8} fill={current === idx ? "currentColor" : "none"} />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HeroCarousel;