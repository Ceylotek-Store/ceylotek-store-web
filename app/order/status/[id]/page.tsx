"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CheckCircle, MapPin, Phone, Calendar, ArrowRight, Package, Home } from "lucide-react";
import api from "@/lib/api"; // Ensure you use the protected client
import { toast } from "react-hot-toast";
import Confetti from "react-confetti"; // npm install react-confetti

interface Order {
  id: number;
  totalAmount: string;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  contactPhone: string;
  createdAt: string;
  items: {
    id: number;
    quantity: number;
    price: string;
    product: {
      name: string;
      imageUrl: string;
    };
  }[];
}

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = params.id;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set window size for confetti
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to load order", error);
        toast.error("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ADB5]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-[#393E46]">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link href="/" className="text-[#00ADB5] hover:underline">Return Home</Link>
      </div>
    );
  }

  const uploadsBackendUrl = process.env.NEXT_PUBLIC_UPLOADS_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

  return (
    <div className="min-h-screen relative bg-[#222831] py-6 md:py-12 flex items-center justify-center overflow-x-hidden">
      
      {/* Celebration Effect */}
      <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />

      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
         <div className="absolute inset-0 bg-gradient-to-b from-[#222831] to-transparent z-10"></div>
         <Image 
            src="/order-status.png" 
            alt="Background" 
            fill 
            className="object-cover"
            priority
            unoptimized={true}
         />
      </div>

      {/* Receipt Card */}
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden mx-4 my-4 animate-in zoom-in-95 duration-500">
        
        {/* Success Header */}
        <div className="bg-[#00ADB5] p-6 md:p-8 text-center text-white">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner">
            <CheckCircle size={32} className="md:w-12 md:h-12 text-white drop-shadow-md" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide drop-shadow-md">Order Confirmed!</h1>
          <p className="opacity-90 mt-2 text-xs md:text-sm font-medium">Thank you for your purchase. Your order #{order.id} has been received.</p>
        </div>

        <div className="p-5 md:p-8">
          
          {/* Order Meta Data */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-sm text-gray-600 border-b border-gray-100 pb-8 text-center sm:text-left">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Date</span>
              <div className="flex items-center gap-2 font-semibold text-[#393E46]">
                <Calendar size={16} className="text-[#00ADB5]" />
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-start">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Method</span>
               <div className="font-semibold text-[#393E46] bg-gray-100 px-3 py-1 rounded-full text-xs">
                 {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Card Payment'}
               </div>
            </div>
            <div className="flex flex-col items-center sm:items-start">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Status</span>
               <div className="font-bold text-[#00ADB5] bg-[#00ADB5]/10 px-3 py-1 rounded-full text-xs border border-[#00ADB5]/20">
                 {order.status}
               </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-8 border border-gray-100">
            <h3 className="text-[#222831] font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
              <MapPin size={18} className="text-[#00ADB5]" /> Delivery To
            </h3>
            <div className="text-sm text-gray-600 space-y-2 ml-0 md:ml-6 border-l-0 md:border-l-2 border-gray-200 pl-0 md:pl-4">
              <p className="leading-relaxed">{order.shippingAddress}</p>
              <p className="flex items-center gap-2 mt-2">
                <span className="font-bold text-[#393E46] text-xs uppercase bg-white px-2 py-0.5 rounded border border-gray-200">Contact</span> 
                <span className="flex items-center gap-1 font-mono text-[#393E46]">{order.contactPhone}</span>
              </p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-4 mb-8">
            <h3 className="text-[#222831] font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Package size={18} className="text-[#00ADB5]" /> Order Summary
            </h3>
            
            {order.items.map((item) => {
               const imageUrl = item.product.imageUrl.startsWith("http") 
                  ? item.product.imageUrl 
                  : `${uploadsBackendUrl}${item.product.imageUrl}`;

               return (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-[#00ADB5]/30 transition-colors bg-white hover:shadow-sm gap-3">
                  <div className="flex items-center gap-4 w-full">
                    <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                      <Image 
                        src={imageUrl} 
                        alt={item.product.name} 
                        fill 
                        className="object-contain p-1"
                        unoptimized={true}
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-[#393E46] text-sm line-clamp-2">{item.product.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: <span className="font-semibold text-[#222831]">{item.quantity}</span></p>
                    </div>
                  </div>
                  <div className="font-bold text-[#393E46] text-sm w-full sm:w-auto text-right sm:text-left pl-[4.5rem] sm:pl-0">
                    Rs. {(parseFloat(item.price) * item.quantity).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-6 mb-8">
            <span className="text-base md:text-lg font-medium text-gray-500">Total Paid</span>
            <span className="text-2xl md:text-3xl font-extrabold text-[#00ADB5]">Rs. {parseFloat(order.totalAmount).toLocaleString()}</span>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link 
              href="/"
              className="flex-1 bg-[#393E46] text-white py-3 md:py-4 rounded-md font-bold text-center hover:bg-[#222831] transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 text-sm md:text-base"
            >
              <Home size={18} /> Back to Home
            </Link>
            <Link 
              href="/profile"
              className="flex-1 bg-[#00ADB5] text-white py-3 md:py-4 rounded-md font-bold text-center hover:bg-[#008c93] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00ADB5]/30 hover:-translate-y-0.5 text-sm md:text-base"
            >
              View Order History <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}