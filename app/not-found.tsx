import Link from 'next/link';
import Image from 'next/image';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col justify-end md:justify-center items-center text-center overflow-hidden">
      
      {/* 1. BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/404-robot.png" 
          alt="404 Background"
          fill
          className="object-cover object-center" // Center the robot
          priority
          unoptimized={true}
        />
        {/* 2. RESPONSIVE OVERLAY */}
        {/* Mobile: Heavy gradient at bottom to make text readable. Desktop: More subtle. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#222831] via-[#222831]/80 to-transparent md:via-[#222831]/40" />
      </div>

      {/* 3. CONTENT */}
      {/* Added 'pb-12' for mobile spacing and 'md:pb-0' to reset on desktop */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-16 md:pb-0">
        
        {/* Title: Smaller on mobile (6xl), Massive on Desktop (9xl) */}
        <h1 className="text-6xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00ADB5] to-white mb-2 tracking-tighter drop-shadow-2xl">
          404
        </h1>
        
        <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
          System Malfunction.
        </h2>
        
        <p className="text-gray-300 text-base md:text-xl mb-8 max-w-lg mx-auto leading-relaxed drop-shadow-sm">
          The page you requested has been disconnected. <br className="hidden md:block" />
          Our robot is working hard to fix the wires... or maybe just crying about it.
        </p>

        {/* Action Buttons: Stacked on mobile, Row on Desktop */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 bg-[#00ADB5] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#008c93] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#00ADB5]/30 active:scale-95"
          >
            <Home size={20} />
            Return Home
          </Link>
          
          <Link 
            href="/products"
            className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/20 transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
            Browse Products
          </Link>
        </div>

      </div>
    </div>
  );
}