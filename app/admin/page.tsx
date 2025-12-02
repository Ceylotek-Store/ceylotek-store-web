"use client";

import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
    Package, MapPin,
    ChevronDown, ChevronUp, Filter, RefreshCw, Truck, CheckCircle, XCircle, Clock, User
} from "lucide-react";

// --- 1. CLEAR TYPES ---
// Define exactly what data we expect. This makes coding easier and safer.
type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
    id: number;
    quantity: number;
    price: string;
    product: {
        name: string;
    };
}

interface UserInfo {
    id: number;
    name: string;
    email: string;
}

interface Order {
    id: number;
    totalAmount: string;
    status: OrderStatus;
    paymentMethod: string;
    shippingAddress: string;
    contactPhone: string;
    createdAt: string;
    user: UserInfo;
    items: OrderItem[];
}

const STATUS_OPTIONS: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // --- 2. SIMPLE STATE ---
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    // --- 3. PROTECTION LOGIC ---
    //print authloading value and user details in console
    console.log("Auth Loading:", authLoading);
    console.log("User Details:", user);

    // --- 1. SMART ROUTE PROTECTION (The Fix) ---
    // We use a local state to prevent early redirects
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // A. If global auth is loading, do nothing.
        if (authLoading) return;

        // B. Check for User Object
        if (user) {
            // User exists -> Check Role
            if (user.role === 'ADMIN' || user.role === 'SHOP_OWNER') {
                setIsAuthorized(true); // Access Granted
            } else {
                toast.error("Access Denied: Admins Only");
                router.replace("/");
            }
        } else {
            // C. User is NULL -> Critical Check
            // Before redirecting, check LocalStorage manually.
            // If token exists there, it means AuthContext is just slow. WE WAIT.
            const hasSession = typeof window !== 'undefined' && sessionStorage.getItem("ceylotek_user");

            if (!hasSession) {
                // Only redirect if there is absolutely no trace of a user
                router.replace("/login");
            }
            // If hasSession is true, we do nothing. 
            // We just wait for the next render where 'user' will be populated.
        }
    }, [user, authLoading, router]);

    // --- 4. FETCH LOGIC ---
    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get("/orders/admin/all");
            setOrders(res.data);
        } catch (error) {
            console.error("Admin fetch error", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    // Load data when user is ready
    useEffect(() => {
        if (user?.role === 'ADMIN' || user?.role === 'SHOP_OWNER') {
            fetchAllOrders();
        }
    }, [user]);

    // --- 5. UPDATE LOGIC ---
    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        setUpdatingId(orderId);

        // Optimistic Update: Update UI immediately so it feels fast
        setOrders(prevOrders => prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus as OrderStatus } : order
        ));

        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order #${orderId} updated`);
        } catch (error) {
            toast.error("Update failed");
            fetchAllOrders(); // Revert changes if API fails
        } finally {
            setUpdatingId(null);
        }
    };

    // Toggle Row Logic (Open/Close details)
    const toggleRow = (id: number) => {
        if (expandedOrderId === id) {
            setExpandedOrderId(null); // Close if already open
        } else {
            setExpandedOrderId(id); // Open new one
        }
    };

    // --- 6. VISUAL HELPERS ---
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "PROCESSING": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "SHIPPED": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "DELIVERED": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "CANCELLED": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING": return <Clock size={14} />;
            case "PROCESSING": return <RefreshCw size={14} />;
            case "SHIPPED": return <Truck size={14} />;
            case "DELIVERED": return <CheckCircle size={14} />;
            case "CANCELLED": return <XCircle size={14} />;
            default: return <Package size={14} />;
        }
    };

    // Filter the list based on dropdown selection
    const filteredOrders = filterStatus === "ALL"
        ? orders
        : orders.filter(o => o.status === filterStatus);

    // Don't show anything while checking auth
    if (authLoading || !user) return null;

    return (
        <div className="min-h-screen bg-[#0f1115] text-gray-200 relative font-sans overflow-hidden">

            {/* Background Image */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">

                <Image
                    src="/order-status.png"
                    alt="Admin Background"
                    fill
                    className="object-cover opacity-40" // Increased visibility slightly
                    unoptimized={true}
                    priority
                />

                {/* GRADIENT FIX: 
      Changed 'from-[#0f1115]' (Solid) to 'from-[#0f1115]/30' (Transparent).
      Now the top of the image is visible, and it fades into the dark background at the bottom.
  */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f1115]/30 via-[#0f1115]/80 to-[#0f1115]"></div>

            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <span className="text-[#00ADB5]">Admin</span> Dashboard
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Manage orders and store status.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-[#1a1d24]/80 border border-gray-700 px-5 py-3 rounded-lg text-center backdrop-blur-md shadow-lg">
                            <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Total Orders</span>
                            <span className="text-2xl font-bold text-white">{orders.length}</span>
                        </div>
                        <div className="bg-[#1a1d24]/80 border border-gray-700 px-5 py-3 rounded-lg text-center backdrop-blur-md shadow-lg">
                            <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Pending</span>
                            <span className="text-2xl font-bold text-yellow-400">
                                {orders.filter(o => o.status === 'PENDING').length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- CONTROLS BAR --- */}
                <div className="flex justify-between items-center mb-6 bg-[#1a1d24]/60 p-4 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-md">
                    <div className="flex items-center gap-3">
                        <Filter size={18} className="text-[#00ADB5]" />
                        <span className="text-sm font-medium text-gray-400 hidden sm:inline">Filter Status:</span>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-[#0f1115] border border-gray-600 text-white text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-[#00ADB5] transition-colors cursor-pointer"
                        >
                            <option value="ALL">All Orders</option>
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={fetchAllOrders}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#222831] hover:bg-[#2c333e] text-white text-sm rounded-md border border-gray-600 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>

                {/* --- DESKTOP TABLE VIEW --- */}
                <div className="hidden md:block bg-[#1a1d24]/80 border border-gray-700 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#222831]/80 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
                                <th className="p-5 font-semibold">Order ID</th>
                                <th className="p-5 font-semibold">Customer</th>
                                <th className="p-5 font-semibold">Date</th>
                                <th className="p-5 font-semibold">Total</th>
                                <th className="p-5 font-semibold">Current Status</th>
                                <th className="p-5 font-semibold text-right">Update Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50 text-sm">
                            {filteredOrders.map((order) => (
                                // Use Fragment with KEY here to fix the React warning
                                <Fragment key={order.id}>

                                    {/* Main Row */}
                                    <tr
                                        onClick={() => toggleRow(order.id)}
                                        className={`cursor-pointer transition-colors group ${expandedOrderId === order.id ? "bg-[#222831]/60" : "hover:bg-[#222831]/40"}`}
                                    >
                                        <td className="p-5 font-mono text-[#00ADB5] font-bold flex items-center gap-2">
                                            {expandedOrderId === order.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            #{order.id}
                                        </td>
                                        <td className="p-5">
                                            <div className="font-medium text-white flex items-center gap-2">
                                                <User size={14} className="text-gray-500" /> {order.user.name}
                                            </div>
                                            <div className="text-xs text-gray-500 ml-6">{order.user.email}</div>
                                        </td>
                                        <td className="p-5 text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-5 font-bold text-white">
                                            Rs. {parseFloat(order.totalAmount).toLocaleString()}
                                        </td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                                                {getStatusIcon(order.status)} {order.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            {/* Stop propagation here so clicking dropdown doesn't expand row */}
                                            <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                                                <select
                                                    value={order.status}
                                                    disabled={updatingId === order.id}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className={`
                                appearance-none bg-[#0f1115] border border-gray-600 text-gray-300 text-xs rounded-md pl-3 pr-8 py-1.5 
                                focus:border-[#00ADB5] focus:ring-1 focus:ring-[#00ADB5] outline-none cursor-pointer hover:border-gray-500 transition-colors
                                ${updatingId === order.id ? "opacity-50 cursor-wait" : ""}
                            `}
                                                >
                                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Details Row */}
                                    {expandedOrderId === order.id && (
                                        <tr className="bg-[#15181e] animate-in fade-in slide-in-from-top-1 duration-200">
                                            <td colSpan={6} className="p-0">
                                                <div className="p-6 border-b border-gray-700 shadow-inner">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                                        {/* Shipping Details */}
                                                        <div>
                                                            <h4 className="text-[#00ADB5] text-xs uppercase font-bold mb-3 flex items-center gap-2">
                                                                <MapPin size={14} /> Delivery Details
                                                            </h4>
                                                            <div className="bg-[#0f1115] p-4 rounded-md border border-gray-700 text-sm text-gray-300 space-y-3">
                                                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                                                    <span className="text-gray-500">Customer Name</span>
                                                                    <span className="font-medium text-white">{order.user.name}</span>
                                                                </div>
                                                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                                                    <span className="text-gray-500">Contact Number</span>
                                                                    <span className="font-medium text-white">{order.contactPhone}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-gray-500">Shipping Address</span>
                                                                    <span className="font-medium text-white leading-relaxed">{order.shippingAddress}</span>
                                                                </div>
                                                                <div className="flex justify-between pt-1">
                                                                    <span className="text-gray-500">Payment Method</span>
                                                                    <span className="text-[#00ADB5] font-bold">{order.paymentMethod}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Items List */}
                                                        <div>
                                                            <h4 className="text-[#00ADB5] text-xs uppercase font-bold mb-3 flex items-center gap-2">
                                                                <Package size={14} /> Order Items ({order.items.length})
                                                            </h4>
                                                            <div className="bg-[#0f1115] p-4 rounded-md border border-gray-700 text-sm text-gray-300 space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                                                                {order.items.map((item) => (
                                                                    <div key={item.id} className="flex justify-between items-center border-b border-gray-800 pb-2 last:border-0 last:pb-0 hover:bg-[#1a1d24] p-2 rounded transition-colors">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 bg-[#222831] rounded flex items-center justify-center text-[#00ADB5] text-xs font-bold">
                                                                                {item.quantity}x
                                                                            </div>
                                                                            <span className="font-medium text-white">{item.product.name}</span>
                                                                        </div>
                                                                        <span className="font-mono text-gray-400">Rs. {parseFloat(item.price).toLocaleString()}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="mt-3 text-right">
                                                                <span className="text-gray-500 text-xs uppercase font-bold mr-2">Grand Total:</span>
                                                                <span className="text-lg font-bold text-[#00ADB5]">Rs. {parseFloat(order.totalAmount).toLocaleString()}</span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {filteredOrders.length === 0 && (
                        <div className="p-12 text-center text-gray-500 bg-[#1a1d24]/50">
                            <Package size={48} className="mx-auto mb-3 opacity-20" />
                            <p>No orders found matching this filter.</p>
                        </div>
                    )}
                </div>

                {/* --- MOBILE VIEW (Simple Cards) --- */}
                <div className="md:hidden space-y-4 pb-20">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-[#1a1d24]/90 border border-gray-700 rounded-xl p-5 shadow-lg backdrop-blur-md">

                            <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-3">
                                <div>
                                    <h3 className="text-[#00ADB5] font-bold text-lg">Order #{order.id}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border ${getStatusBadge(order.status)}`}>
                                    {getStatusIcon(order.status)} {order.status}
                                </span>
                            </div>

                            <div className="space-y-3 text-sm text-gray-300 mb-5">
                                {/* Address Box for Mobile */}
                                <div className="bg-[#0f1115] p-3 rounded border border-gray-800">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><MapPin size={10} /> Deliver To:</p>
                                    <p className="font-bold text-white mb-1">{order.user.name}</p>
                                    <p className="text-xs text-gray-400 leading-tight">{order.shippingAddress}</p>
                                    <p className="text-xs text-[#00ADB5] mt-1 font-mono">{order.contactPhone}</p>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                                    <span className="text-gray-500 text-xs uppercase font-bold">Total</span>
                                    <span className="font-bold text-[#00ADB5] text-base">Rs. {parseFloat(order.totalAmount).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="bg-[#222831] p-3 rounded-lg border border-gray-800">
                                <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide font-bold">Update Status</p>
                                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar snap-x">
                                    {STATUS_OPTIONS.map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(order.id, status)}
                                            disabled={updatingId === order.id}
                                            className={`
                        snap-start px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-all border
                        ${order.status === status
                                                    ? "bg-[#00ADB5] text-white border-[#00ADB5] shadow-[0_0_10px_rgba(0,173,181,0.3)]"
                                                    : "bg-transparent text-gray-400 border-gray-600 hover:border-gray-400"}
                      `}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}