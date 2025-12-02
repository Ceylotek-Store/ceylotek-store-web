"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast"; // Import toast

// 1. Define interface matching your Backend JSON structure
export interface BackendProductType {
  id: number;
  name: string;
  price: string;
  stock: number;
  imageUrl: string;
  description?: string;
  category?: string;
}

const ProductCard = ({ product }: { product: BackendProductType }) => {
  const { addToCart } = useCart();
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const uploadsBackendUrl = process.env.NEXT_PUBLIC_UPLOADS_BACKEND_URL;

  const fullImageUrl = backendUrl && product.imageUrl 
    ? `${uploadsBackendUrl}${product.imageUrl}` 
    : '/placeholder.png';

  const inStock = product.stock > 0;
  const numericPrice = parseFloat(product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (inStock) {
      addToCart(product);
      // Trigger the popup notification
      toast.success(`${product.name} added to cart!`, {
        style: {
          background: '#333',
          color: '#fff',
        },
        iconTheme: {
          primary: '#00ADB5',
          secondary: '#FFFAEE',
        },
      });
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <div className="group h-full bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col relative">
        
        <div className="relative w-full h-[250px] bg-gray-50 overflow-hidden">
          {!inStock && (
             <div className="absolute top-2 right-2 z-10 bg-[#393E46] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
               Out of Stock
             </div>
          )}
          
          <Image 
            src={fullImageUrl} 
            alt={product.name} 
            fill 
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" 
            unoptimized={true}
          />
        </div>

        <div className="p-5 flex flex-col flex-grow justify-between">
          <div>
            <h3 className="text-[#393E46] font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#00ADB5] transition-colors">
              {product.name}
            </h3>
            
            <div className="mb-3">
              {inStock ? (
                <span className="inline-flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-[#00ADB5] font-bold text-lg tracking-tight font-sans">
              Rs. {!isNaN(numericPrice) ? numericPrice.toLocaleString() : product.price}.00
            </div>
            
             {/* ADDED: 'cursor-pointer' to the enabled classes.
                The disabled state already has 'cursor-not-allowed'.
             */}
             <button 
                disabled={!inStock}
                onClick={handleAddToCart}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${inStock ? "bg-[#393E46] text-white group-hover:bg-[#00ADB5] cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
             >
                 <ShoppingCart size={16} />
             </button>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;