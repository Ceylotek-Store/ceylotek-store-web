"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, totalItems } = useCart();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const uploadsBackendUrl = process.env.NEXT_PUBLIC_UPLOADS_BACKEND_URL;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-[#222831] mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/" className="bg-[#00ADB5] text-white px-8 py-3 rounded-full font-bold hover:bg-[#008c93] transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#222831] mb-8">Shopping Cart ({totalItems})</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: Cart Items List */}
          <div className="flex-grow">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {cart.map((item) => {
                 const imageUrl = uploadsBackendUrl && item.imageUrl ? `${uploadsBackendUrl}${item.imageUrl}` : '/placeholder.png';
                 
                 return (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-6 border-b border-gray-100 last:border-0">
                    
                    {/* Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
                      <Image src={imageUrl} alt={item.name} fill className="object-contain p-2" unoptimized={true} />
                    </div>

                    {/* Details */}
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="font-bold text-[#393E46] text-lg">{item.name}</h3>
                      <p className="text-[#00ADB5] font-bold mt-1">Rs. {parseFloat(item.price).toLocaleString()}.00</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-[#00ADB5] disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-[#222831] w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-[#00ADB5]"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="w-full lg:w-[350px] flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-[#222831] mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#393E46]">Rs. {cartTotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-[#00ADB5]">
                  <span>Discount</span>
                  <span>Rs. 0.00</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-lg font-bold text-[#222831]">
                  <span>Total</span>
                  <span>Rs. {cartTotal.toLocaleString()}.00</span>
                </div>
              </div>

              <Link href="/order/checkout" className="w-full bg-[#222831] text-white py-3.5 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-[#00ADB5] transition-all">
                Proceed to Checkout <ArrowRight size={18} />
              </Link>
              
              <Link href="/" className="block text-center text-sm text-gray-500 mt-4 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}