"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BackendProductType } from "@/components/ProductCard"; 

export interface CartItem extends BackendProductType {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: BackendProductType) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // 1. Initialize with empty array to prevent Hydration Mismatch
  const [cart, setCart] = useState<CartItem[]>([]);
  // 2. Add a flag to track if we have loaded data yet
  const [isInitialized, setIsInitialized] = useState(false);

  // 3. Load Cart from sessionStorage (Runs only on Client)
  useEffect(() => {
    // We use setTimeout to move this update to the next "tick"
    // This solves the "synchronous setState" linter warning
    const timer = setTimeout(() => {
      const storedCart = sessionStorage.getItem("ceylotek_cart");
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (error) {
          console.error("Failed to parse cart data", error);
        }
      }
      setIsInitialized(true); // Mark as ready
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 4. Save Cart to sessionStorage (Only if initialized)
  useEffect(() => {
    if (!isInitialized) return; // Don't save empty array before loading finishes
    sessionStorage.setItem("ceylotek_cart", JSON.stringify(cart));
  }, [cart, isInitialized]);

  // --- ACTIONS ---

  const addToCart = (product: BackendProductType) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- CALCULATIONS ---
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartTotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price);
    return total + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};