"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";

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
  
  // Get base URL for local images (fallback)
  const uploadsBackendUrl = process.env.NEXT_PUBLIC_UPLOADS_BACKEND_URL || 'http://localhost:5000';

  // --- LOGIC UPDATE START ---
  // Check if image URL is absolute (S3) or relative (Local)
  let fullImageUrl = '/placeholder.png';

  if (product.imageUrl) {
    if (product.imageUrl.startsWith('http')) {
      // Case 1: S3 URL (Already full link)
      fullImageUrl = product.imageUrl;
    } else {
      // Case 2: Local Upload (Needs backend prefix)
      fullImageUrl = `${uploadsBackendUrl}${product.imageUrl}`;
    }
  }
  // --- LOGIC UPDATE END ---

  const inStock = product.stock > 0;
  const numericPrice = parseFloat(product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (inStock) {
      addToCart(product);
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
            unoptimized={true}
            fill 
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" 
            // Removed unoptimized={true} to allow Next.js to optimize S3 images
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
  );
};

export default ProductCard;