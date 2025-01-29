"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";

interface ProductGridItemProps {
  product: any;
  onNavigate: (id: string) => void;
  onAddToCart: (product: any) => void;
}

export default function ProductGridItem({ product, onNavigate, onAddToCart }: ProductGridItemProps) {
  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={() => onNavigate(product.id)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-square bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {product.status !== "IN_STOCK" && (
          <div className="absolute top-2 right-2">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              <span
                className={`text-sm font-medium ${
                  product.status === "OUT_OF_STOCK"
                    ? "text-red-600"
                    : "text-orange-600"
                }`}
              >
                {product.status === "OUT_OF_STOCK" ? "Out of Stock" : "Low Stock"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-blue-600 font-medium">
            {product.category.name}
          </span>
          <span className="text-xs text-gray-500 ml-2">
            SKU: {product.sku}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={product.status === "OUT_OF_STOCK"}
            className={`p-2 rounded-full transition-all duration-200 ${
              product.status === "IN_STOCK"
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25"
                : "bg-gray-200 cursor-not-allowed text-gray-400"
            }`}
          >
            <FaShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}