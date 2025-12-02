"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api"; // Smart client handles tokens
import { User, Package, Calendar, MapPin, CreditCard, ChevronDown, ChevronUp, Loader2, LogOut } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

// --- TYPES ---
interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: string; // Decimal comes as string from backend usually
  product: Product;
}

interface Order {
  id: number;
  totalAmount: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: "COD" | "CARD";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  // --- 1. SMART ROUTE PROTECTION ---
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // A. If global auth is loading, do nothing.
    if (authLoading) return;

    // B. Check for User Object
    if (user) {
      setIsAuthorized(true); // Access Granted
    } else {
      // C. User is NULL -> Critical Check
      // Before redirecting, check LocalStorage manually.
      const hasSession = typeof window !== 'undefined' && sessionStorage.getItem("ceylotek_user");

      if (!hasSession) {
        router.replace("/login");
      }
      // If hasSession is true, we wait for the next render where 'user' will be populated.
    }
  }, [user, authLoading, router]);

  // 2. Fetch Orders
  useEffect(() => {
    // Don't run if user isn't ready
    if (!user) return;

    // 1. Create the AbortController
    const controller = new AbortController();
    const { signal } = controller;

    const fetchOrders = async () => {
      try {
        // 2. Pass the signal to the axios call
        const res = await api.get("/orders/my-orders", { signal });

        // Only update state if the signal hasn't been aborted
        if (!signal.aborted) {
          setOrders(res.data);
        }
      } catch (error) {
        // 3. Check if the error was caused by the abort controller
        if (axios.isCancel(error)) {
          console.log("Order fetch aborted due to remount.");
          // Ignore this error, it's intentional
        } else {
          // Handle real errors
          console.error("Failed to fetch orders", error);
          toast.error("Could not load order history");
        }
      } finally {
        // Only turn off loading if not aborted to prevent flickering
        if (!signal.aborted) {
          setLoadingOrders(false);
        }
      }
    };

    fetchOrders();

    // 4. The Cleanup Function
    // React calls this when the component unmounts or before re-running the effect.
    // This cancels any pending request.
    return () => {
      controller.abort();
    };
  }, [user]);

  // Helper: Format Date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper: Status Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-700";
      case "SHIPPED": return "bg-blue-100 text-blue-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      case "PROCESSING": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700"; // PENDING
    }
  };

  // Prevent flash
  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* === LEFT: USER PROFILE CARD === */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-[#222831] h-24 relative">
                {/* Profile Avatar */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                  <div className="w-20 h-20 bg-white rounded-full p-1 shadow-md flex items-center justify-center">
                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-[#393E46]">
                      <User size={32} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-12 pb-6 px-6 text-center">
                <h2 className="text-xl font-bold text-[#222831]">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                <div className="inline-block bg-[#00ADB5]/10 text-[#00ADB5] text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {user.role} Account
                </div>

                <hr className="my-6 border-gray-100" />

                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-md transition-colors font-medium text-sm"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* === RIGHT: ORDER HISTORY === */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#222831] mb-6 flex items-center gap-2">
              <Package className="text-[#00ADB5]" /> Order History
            </h1>

            {loadingOrders ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
                <Loader2 className="animate-spin text-[#00ADB5] mb-2" size={32} />
                <p className="text-gray-500">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Package size={32} />
                </div>
                <h3 className="text-lg font-bold text-[#393E46]">No orders yet</h3>
                <p className="text-gray-500 mb-6">Looks like you haven&apos;t placed any orders yet.</p>
                <button
                  onClick={() => router.push("/")}
                  className="bg-[#00ADB5] text-white px-6 py-2 rounded-md font-bold hover:bg-[#008c93] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">

                    {/* ORDER HEADER (Always Visible) */}
                    <div
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between cursor-pointer bg-gray-50 hover:bg-white transition-colors gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#222831] text-lg">Order #{order.id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(order.createdAt)}</span>
                          <span className="flex items-center gap-1"><CreditCard size={14} /> {order.paymentMethod}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase">Total Amount</p>
                          <p className="text-[#00ADB5] font-bold text-lg">Rs. {parseFloat(order.totalAmount).toLocaleString()}</p>
                        </div>
                        {expandedOrderId === order.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                      </div>
                    </div>

                    {/* ORDER DETAILS (Collapsible) */}
                    {expandedOrderId === order.id && (
                      <div className="p-5 border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-200">

                        {/* Shipping Info */}
                        <div className="mb-6 flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                          <MapPin size={16} className="text-[#00ADB5] mt-0.5 flex-shrink-0" />
                          <span><strong>Shipping to:</strong> {order.shippingAddress}</span>
                        </div>

                        {/* Items List */}
                        <div className="space-y-4">
                          {order.items.map((item) => {
                            // Handle Image URL (Standard fix for backend images)
                            const uploadsBackendUrl = process.env.NEXT_PUBLIC_UPLOADS_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
                            const imageUrl = item.product.imageUrl.startsWith("http")
                              ? item.product.imageUrl
                              : `${uploadsBackendUrl}${item.product.imageUrl}`;

                            return (
                              <div key={item.id} className="flex items-center gap-4 border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                                <div className="relative w-16 h-16 bg-gray-50 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                                  <Image
                                    src={imageUrl}
                                    alt={item.product.name}
                                    fill
                                    className="object-contain p-1"
                                    unoptimized={true}
                                  />
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-bold text-[#393E46] text-sm">{item.product.name}</h4>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <div className="font-bold text-[#393E46] text-sm">
                                  Rs. {parseFloat(item.price).toLocaleString()}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}