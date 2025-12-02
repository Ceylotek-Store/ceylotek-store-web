"use client";

import HeroCarousel from "@/components/HeroCarousel";
import FeaturedCategories from "@/components/FeaturedCategories";
import LatestProducts from "@/components/LatestProducts";


export default function Home() {

  return (
    <main className="min-h-screen bg-white font-sans">
      
      <HeroCarousel />
      <FeaturedCategories />
      <LatestProducts />
    </main>
  );
}