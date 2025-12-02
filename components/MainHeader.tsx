"use client";

import { useState } from "react"; // 1. Import useState
import Link from "next/link";
import { useRouter } from "next/navigation"; // 2. Import useRouter
import { Search, ShoppingBag, Menu } from "lucide-react";
import UserDropdown from "@/components/UserDropdown";
import { useCart } from "@/context/CartContext";

interface MainHeaderProps {
  onOpenMenu: () => void;
}

const MainHeader = ({ onOpenMenu }: MainHeaderProps) => {
  const { totalItems } = useCart();
  const [searchTerm, setSearchTerm] = useState(""); // 3. State for search input
  const router = useRouter(); // 4. Router instance

  // 5. Search Logic
  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Redirect to /products?search=...
      // encodeURIComponent ensures special characters don't break the URL
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // 6. Handle "Enter" key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm md:shadow-none md:static">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ==============================================
            MOBILE VIEW (Simplified)
           ============================================== */}
        <div className="flex md:hidden h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onOpenMenu} className="text-[#393E46] hover:text-[#00ADB5] transition-colors">
              <Menu size={26} />
            </button>
          </div>

          <div className="flex-shrink-0">
             <Link href="/" className="text-2xl font-extrabold tracking-tight">
              <span className="text-[#222831]">Ceylo</span>
              <span className="text-[#00ADB5]">tek</span>
              <span className="text-[#222831]">.lk</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative text-[#393E46]">
                <ShoppingBag size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#00ADB5] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
            </Link>
          </div>
        </div>


        {/* ==============================================
            DESKTOP VIEW
           ============================================== */}
        <div className="hidden md:flex flex-row items-center justify-between gap-8 py-6">
          
          {/* 1. Brand Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-extrabold tracking-tight">
              <span className="text-[#222831]">Ceylo</span>
              <span className="text-[#00ADB5]">tek</span>
            </Link>
          </div>

          {/* 2. SEARCH BAR (Connected Logic) */}
          <div className="w-full max-w-2xl">
            <div className="flex items-center border border-[#393E46]/20 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-[#00ADB5] transition-all bg-[#EEEEEE]/30">
              <input 
                type="text" 
                placeholder="Search for products..." 
                className="flex-grow px-6 py-2.5 outline-none text-sm text-[#393E46] placeholder-gray-400 bg-transparent"
                value={searchTerm} // Bind value
                onChange={(e) => setSearchTerm(e.target.value)} // Update state
                onKeyDown={handleKeyDown} // Listen for Enter key
              />
              <button 
                onClick={handleSearch} // Listen for Click
                className="px-6 py-2.5 bg-[#222831] hover:bg-[#393E46] text-white transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* 3. Actions (Cart & Profile) */}
          <div className="flex items-center space-x-6 flex-shrink-0">
            
            {/* Cart Icon */}
            <Link href="/cart" className="relative group text-[#393E46] hover:text-[#00ADB5] transition-colors">
              <ShoppingBag size={26} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#00ADB5] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Profile Component */}
            <UserDropdown />

          </div>
        </div>

      </div>
    </div>
  );
};

export default MainHeader;