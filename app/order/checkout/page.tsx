"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Loader2, CreditCard, Banknote, MapPin, Phone, Lock, X } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api"; 
import { AxiosError } from "axios"; 

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    phone: "",
    note: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  
  // New state to prevent "Empty Cart" redirect during success transition
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Route Protection
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to checkout", { id: "auth-error" });
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // 2. Empty Cart Redirect
  // We added '!isSuccess' check so we don't get kicked out when we clear cart after payment
  useEffect(() => {
    if (!authLoading && user && cart.length === 0 && !isSuccess) {
      router.replace("/cart");
    }
  }, [cart.length, authLoading, user, router, isSuccess]);

  if (authLoading || !user) return null; 
  if (cart.length === 0 && !isSuccess) return null;

  // --- LOGIC ---

  const handlePlaceOrder = async () => {
    if (!formData.address || !formData.city || !formData.phone) {
      toast.error("Please fill in all shipping details");
      return;
    }

    if (paymentMethod === "CARD") {
      setShowCardModal(true);
    } else {
      submitOrderToBackend();
    }
  };

  const submitOrderToBackend = async () => {
    console.log("🚀 [Checkout] Submitting order...");
    setIsProcessing(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: `${formData.address}, ${formData.city}`,
        contactPhone: formData.phone,
        paymentMethod: paymentMethod,
        totalAmount: cartTotal
      };

      // 1. Send Request
      const response = await api.post("/orders", orderData);
      console.log("✅ [Checkout] Success:", response.data);

      // 2. Mark as success to block "Empty Cart" redirect
      setIsSuccess(true);

      // 3. Clear Cart
      clearCart(); 
      toast.success("Order Placed Successfully! 🎉");
      
      // 4. Redirect to Status Page
      // Assuming backend returns { id: 123, ... } or { orderId: 123 }
      const orderId = response.data.id || response.data.orderId;
      router.push(`/order/status/${orderId}`); 

    } catch (error: unknown) {
      console.error("❌ [Checkout] Failed:", error);
      const axiosError = error as AxiosError<{ error: string }>;
      toast.error(axiosError.response?.data?.error || "Failed to place order");
      setIsProcessing(false); // Only stop processing if error
      setIsSuccess(false); // Reset success flag on error
    } finally {
      setShowCardModal(false);
    }
  };

  const handleMockPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      submitOrderToBackend();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#222831] mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: Forms */}
          <div className="flex-grow space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#222831] mb-4 flex items-center gap-2">
                <MapPin className="text-[#00ADB5]" size={20}/> Shipping Details
              </h2>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Full Address (Street, House No)" 
                  className="w-full p-3 border border-gray-200 rounded-md focus:border-[#00ADB5] outline-none"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="City" 
                    className="w-full p-3 border border-gray-200 rounded-md focus:border-[#00ADB5] outline-none"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Phone Number" 
                    className="w-full p-3 border border-gray-200 rounded-md focus:border-[#00ADB5] outline-none"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#222831] mb-4 flex items-center gap-2">
                <CreditCard className="text-[#00ADB5]" size={20}/> Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${paymentMethod === "COD" ? "border-[#00ADB5] bg-[#00ADB5]/5 text-[#00ADB5]" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <Banknote size={32} />
                  <span className="font-bold text-sm">Cash on Delivery</span>
                </button>

                <button 
                  onClick={() => setPaymentMethod("CARD")}
                  className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${paymentMethod === "CARD" ? "border-[#00ADB5] bg-[#00ADB5]/5 text-[#00ADB5]" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <CreditCard size={32} />
                  <span className="font-bold text-sm">Credit/Debit Card</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-[#222831] mb-4">Your Order</h3>
              
              <div className="max-h-[300px] overflow-y-auto space-y-3 mb-4 pr-1 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 w-2/3 truncate">{item.quantity}x {item.name}</span>
                    <span className="font-bold text-[#393E46]">Rs. {(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between font-bold text-lg text-[#222831]">
                  <span>Total</span>
                  <span>Rs. {cartTotal.toLocaleString()}.00</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing || isSuccess}
                className="w-full mt-6 bg-[#222831] text-white py-4 rounded-md font-bold text-lg hover:bg-[#00ADB5] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : "Confirm Order"}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mock Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-2xl relative">
            <button onClick={() => setShowCardModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
              <X size={24} />
            </button>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-[#222831]">Secure Payment</h3>
              <p className="text-sm text-gray-500">Demo Mode</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleMockPayment(); }} className="space-y-4">
              <input required type="text" placeholder="Card Number (4242...)" className="w-full p-3 border rounded-md font-mono" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="MM/YY" className="w-full p-3 border rounded-md" />
                <input required type="text" placeholder="CVC" className="w-full p-3 border rounded-md" />
              </div>
              <input required type="text" placeholder="Cardholder Name" className="w-full p-3 border rounded-md" />
              <button type="submit" disabled={isProcessing} className="w-full bg-[#00ADB5] text-white py-3 rounded-md font-bold mt-2 hover:bg-[#008c93] flex justify-center">
                {isProcessing ? "Processing..." : `Pay Rs. ${cartTotal.toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}