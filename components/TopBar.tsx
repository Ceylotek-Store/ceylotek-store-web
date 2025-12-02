"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaTiktok } from "react-icons/fa";

const TopBar = () => {
  return (
    <div className="hidden md:block bg-[#222831] text-[#EEEEEE] text-xs py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
        
        {/* Left Side: Promo Text */}
        <div className="text-center md:text-left font-medium tracking-wide">
          Get 8% Discount For Any Bank Transfer Orders
        </div>

        {/* Right Side: Socials + Links */}
        <div className="flex items-center space-x-4 md:space-x-6">
          
          {/* Social Icons */}
          <div className="flex items-center space-x-3 border-r border-[#EEEEEE]/20 pr-4 md:pr-6">
            <Link href="#" className="hover:text-[#00ADB5] transition-colors"><FaFacebookF /></Link>
            <Link href="#" className="hover:text-[#00ADB5] transition-colors"><FaInstagram /></Link>
            <Link href="#" className="hover:text-[#00ADB5] transition-colors"><FaYoutube /></Link>
            <Link href="#" className="hover:text-[#00ADB5] transition-colors"><FaWhatsapp /></Link>
            <Link href="#" className="hover:text-[#00ADB5] transition-colors"><FaTiktok /></Link>
          </div>

          {/* Text Links */}
          <div className="flex items-center space-x-4 font-semibold">
            <Link href="/newsletter" className="hover:text-[#00ADB5] transition-colors hidden sm:block">NEWSLETTER</Link>
            <Link href="/contact" className="hover:text-[#00ADB5] transition-colors">CONTACT US</Link>
            <Link href="/faqs" className="hover:text-[#00ADB5] transition-colors hidden sm:block">FAQS</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;