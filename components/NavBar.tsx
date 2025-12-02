"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, ChevronRight, Watch, Headphones, Speaker, Monitor, Smartphone, Cable, Battery } from "lucide-react";

// --- UPDATED CATEGORIES WITH PATHS ---
// These paths match the query parameter logic we set up in the Products Page
const CATEGORIES = [
  { name: "Smart Watch", icon: <Watch size={18} />, path: "/products?category=SMARTWATCH" },
  { name: "Headphones", icon: <Headphones size={18} />, path: "/products?category=HEADPHONE" },
  { name: "Speakers & Sub", icon: <Speaker size={18} />, path: "/products?category=SPEAKER" },
  { name: "Earbuds", icon: <Headphones size={18} />, path: "/products?category=EARBUD" },
  { name: "PC Accessories", icon: <Monitor size={18} />, path: "/products?category=PC_ACCESSORY" },
  { name: "Phone Covers", icon: <Smartphone size={18} />, path: "/products?category=PHONE_COVER" },
  { name: "Cables", icon: <Cable size={18} />, path: "/products?category=CABLE" },
  { name: "Power Bank", icon: <Battery size={18} />, path: "/products?category=POWER_BANK" },
];

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Blog", path: "/blog" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="bg-[#222831] text-white relative shadow-md hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14">

          {/* === LEFT: CATEGORY BUTTON === */}
          <div className="relative h-full" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`
                h-full px-6 flex items-center gap-3 font-bold uppercase text-sm tracking-wide transition-colors min-w-[260px]
                ${isOpen ? "bg-[#00ADB5] text-white" : "bg-[#393E46] text-white hover:bg-[#00ADB5]"}
              `}
            >
              <Menu size={20} />
              <span className="flex-grow text-left">Browse Categories</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}/>
            </button>

            {/* Dropdown Menu */}
            <div className={`
                absolute top-full left-0 w-[260px] bg-white border border-gray-200 shadow-2xl
                transition-all duration-200 origin-top z-50
                ${isOpen ? "opacity-100 visible scale-y-100" : "opacity-0 invisible scale-y-95"}
            `}>
              <ul className="py-2">
                {CATEGORIES.map((cat, idx) => (
                  <li key={idx}>
                    <Link 
                      href={cat.path} // Using the specific path with query param
                      onClick={() => setIsOpen(false)} // Close menu on click
                      className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 text-sm font-medium text-[#393E46] transition-colors border-b border-gray-100 last:border-0 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 group-hover:text-[#00ADB5] transition-colors">{cat.icon}</span>
                        <span className="group-hover:text-[#00ADB5] transition-colors">{cat.name}</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-[#00ADB5]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* === CENTER/RIGHT: SIMPLE LINKS === */}
          <div className="flex items-center space-x-8 pl-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  href={link.path} 
                  className={`text-sm font-bold uppercase transition-colors ${
                    isActive 
                      ? "text-[#00ADB5]" 
                      : "text-gray-300 hover:text-[#00ADB5]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default NavBar;