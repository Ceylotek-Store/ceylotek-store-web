"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. Import Router
import { X, Search, Heart, LogIn, ChevronRight } from "lucide-react";

const MENU_ITEMS = [
  { name: "HOME", path: "/" },
  { name: "PRODUCTS", path: "/products" },
  { name: "BLOG", path: "/blog" },
  { name: "ABOUT US", path: "/about" },
  { name: "CONTACT", path: "/contact" },
];

const CATEGORY_ITEMS = [
  { name: "Smart Watch", path: "/products?category=SMARTWATCH" },
  { name: "Headphones", path: "/products?category=HEADPHONE" },
  { name: "Speakers & Sub", path: "/products?category=SPEAKER" },
  { name: "Earbuds", path: "/products?category=EARBUD" },
  { name: "PC Accessories", path: "/products?category=PC_ACCESSORY" },
  { name: "Phone Covers", path: "/products?category=PHONE_COVER" },
  { name: "Cables", path: "/products?category=CABLE" },
  { name: "Power Bank", path: "/products?category=POWER_BANK" },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [activeTab, setActiveTab] = useState<"MENU" | "CATEGORIES">("MENU");
  
  // 2. Search Logic State
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      onClose(); // Close menu after search
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col h-full ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Top: Close & Search */}
        <div className="flex-none">
          <div className="flex justify-end p-4 border-b border-gray-100">
            <button onClick={onClose} className="flex items-center text-[#393E46] text-sm font-medium hover:text-[#00ADB5] transition-colors">
              <X size={18} className="mr-1" /> Close
            </button>
          </div>

          <div className="p-4 pb-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#00ADB5] text-[#393E46]"
                value={searchTerm} // Bind value
                onChange={(e) => setSearchTerm(e.target.value)} // Update state
                onKeyDown={handleKeyDown} // Listen for Enter
              />
              <button 
                onClick={handleSearch} // Click handler
                className="absolute right-3 top-2.5 text-gray-400 hover:text-[#00ADB5] transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="flex border-b border-gray-200 mt-2">
            <button 
              onClick={() => setActiveTab("MENU")}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === "MENU" ? "border-b-2 border-[#00ADB5] text-[#00ADB5]" : "text-[#393E46] bg-gray-50"}`}
            >
              Menu
            </button>
            <button 
              onClick={() => setActiveTab("CATEGORIES")}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === "CATEGORIES" ? "border-b-2 border-[#00ADB5] text-[#00ADB5]" : "text-[#393E46] bg-gray-50"}`}
            >
              Categories
            </button>
          </div>
        </div>

        {/* Middle: Scrollable Lists */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "MENU" ? (
            <ul className="flex flex-col text-sm font-semibold text-[#393E46]">
              {MENU_ITEMS.map((item) => (
                <li key={item.name} className="border-b border-gray-100">
                  <Link 
                    href={item.path} 
                    onClick={onClose} 
                    className="block px-5 py-3.5 hover:bg-gray-50 hover:text-[#00ADB5] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col text-sm font-semibold text-[#393E46]">
              {CATEGORY_ITEMS.map((item) => (
                <li key={item.name} className="border-b border-gray-100">
                  <Link 
                    href={item.path}
                    onClick={onClose} 
                    className="flex justify-between items-center px-5 py-3.5 hover:bg-gray-50 hover:text-[#00ADB5] cursor-pointer transition-colors"
                  >
                    <span>{item.name}</span>
                    <ChevronRight size={16} className="text-gray-400"/>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom: User Actions */}
        <div className="flex-none border-t border-gray-200 bg-gray-50 pb-safe"> 
          <ul className="text-sm font-medium text-[#393E46]">
            <li className="border-b border-gray-100">
              <Link href="/profile" onClick={onClose} className="flex items-center px-5 py-3 hover:text-[#00ADB5] transition-colors">
                <Heart size={18} className="mr-3" /> Wishlist
              </Link>
            </li>
            <li>
              <Link href="/login" onClick={onClose} className="flex items-center px-5 py-3 hover:text-[#00ADB5] transition-colors">
                <LogIn size={18} className="mr-3" /> Login / Sign Up
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </>
  );
};

export default MobileMenu;