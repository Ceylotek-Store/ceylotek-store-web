"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // We only need 'register' now (login is not needed here anymore)
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // STANDARD WAY:
    // We call register. The Context/Backend now handles the token generation and saving automatically.
    const success = await register(name, email, password);
    
    if (success) {
      // If successful, user is already logged in by the context. Just redirect.
      router.push("/");
    } else {
      setError("Registration failed. Email might be already in use.");
    }
  };

  return (
    // 'min-h-[80vh]' ensures it centers in the white space below the header without scrolling
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-[#222831] p-8 text-center relative">
          <Link href="/" className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-3xl font-bold text-white tracking-wide">JOIN CEYLOTEK</h2>
          <p className="text-gray-400 text-sm mt-2">Create your account for free</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md text-center font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#00ADB5] focus:ring-1 focus:ring-[#00ADB5] text-[#393E46] transition-all"
                  placeholder="Nuwan Fernando"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#00ADB5] focus:ring-1 focus:ring-[#00ADB5] text-[#393E46] transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#00ADB5] focus:ring-1 focus:ring-[#00ADB5] text-[#393E46] transition-all"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full bg-[#00ADB5] hover:bg-[#008c93] text-white font-bold py-3.5 rounded-md transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "CREATE ACCOUNT"}
            </button>

          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[#00ADB5] font-bold hover:underline">
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}