"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import ProductCard, { BackendProductType } from "@/components/ProductCard";
import { publicApi } from "@/lib/api"; // Use publicApi (no auth needed)

export default function LatestProducts() {
  const [products, setProducts] = useState<BackendProductType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(3); // Default to Desktop

  // 1. Fetch Latest Products
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // Fetching generally returns newest first based on your backend sort
        const res = await publicApi.get("/products"); 
        // Take top 10 items for the slider
        setProducts(res.data.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch latest products", error);
      }
    };

    fetchLatest();
  }, []);

  // 2. Handle Responsive Item Count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1);      // Mobile
      else if (window.innerWidth < 1024) setItemsToShow(2); // Tablet
      else setItemsToShow(3);                               // Desktop
    };

    handleResize(); // Set initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      // If we reach the end, loop back to 0
      prev + 1 > products.length - itemsToShow ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - 1 < 0 ? products.length - itemsToShow : prev - 1
    );
  };

  // 3. Auto-Slide Logic
  useEffect(() => {
    if (isPaused || products.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // 4 Seconds delay

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, products.length, itemsToShow]);

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#222831] uppercase flex items-center gap-2">
            <Zap className="text-[#00ADB5] fill-current" /> New Arrivals
          </h2>
          
          {/* Manual Controls */}
          <div className="flex gap-2">
            <button 
              onClick={prevSlide}
              className="p-2 rounded-full border border-gray-200 hover:bg-[#00ADB5] hover:text-white transition-colors text-[#393E46]"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 rounded-full border border-gray-200 hover:bg-[#00ADB5] hover:text-white transition-colors text-[#393E46]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Slider Container */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              // Magic Math: Shift by (100% / itemsToShow) * currentIndex
              transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` 
            }}
          >
            {products.map((product) => (
              <div 
                key={product.id} 
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}