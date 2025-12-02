"use client";

import { useState } from "react";
// Import all your individual parts
import TopBar from "@/components/TopBar";
import MainHeader from "@/components/MainHeader";
import NavBar from "@/components/NavBar";
import MobileMenu from "@/components/MobileMenu";

const SiteHeader = () => {
  // State is managed here now
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // Use a Fragment (<>...</>) so we don't add extra divs to the DOM
    <>
      <TopBar />
      
      {/* Pass the open function to MainHeader */}
      <MainHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />
      
      {/* The Desktop Navbar */}
      <NavBar />

      {/* The Mobile Menu Drawer */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default SiteHeader;