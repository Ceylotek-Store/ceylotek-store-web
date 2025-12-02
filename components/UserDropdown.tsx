"use client";

import Link from "next/link";
import { User, LogIn, UserPlus, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const UserDropdown = () => {
  const { user, logout } = useAuth();

  return (
    <div className="relative group py-2">
      {/* TRIGGER BUTTON */}
      <button className="flex items-center gap-2 text-[#393E46] group-hover:text-[#00ADB5] transition-colors">
        <div className="bg-gray-100 p-2 rounded-full group-hover:bg-[#00ADB5]/10">
          <User size={24} />
        </div>
        {user && (
          <span className="text-sm font-bold hidden lg:block max-w-[100px] truncate">
            {user.name.split(" ")[0]}
          </span>
        )}
        <ChevronDown size={14} className="hidden lg:block" />
      </button>

      {/* DROPDOWN CONTENT */}
      <div className="absolute right-0 top-full w-56 bg-white border border-gray-100 shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden">
        
        {user ? (
          // === LOGGED IN ===
          <div className="py-2">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 font-medium">Signed in as</p>
              <p className="text-sm font-bold text-[#222831] truncate">{user.email}</p>
            </div>
            
            <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-[#393E46] hover:bg-[#00ADB5]/10 hover:text-[#00ADB5]">
              <Settings size={16} className="mr-2" /> My Profile
            </Link>
            
            <button 
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              <LogOut size={16} className="mr-2" /> Logout
            </button>
          </div>
        ) : (
          // === GUEST ===
          <div className="py-2">
            {/* Link to the new Login Page */}
            <Link href="/login" className="flex items-center px-4 py-2 text-sm text-[#393E46] hover:bg-[#00ADB5]/10 hover:text-[#00ADB5]">
              <LogIn size={16} className="mr-2" /> Login
            </Link>
            
            {/* Link to the new Signup Page */}
            <Link href="/register" className="flex items-center px-4 py-2 text-sm text-[#393E46] hover:bg-[#00ADB5]/10 hover:text-[#00ADB5]">
              <UserPlus size={16} className="mr-2" /> Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDropdown;