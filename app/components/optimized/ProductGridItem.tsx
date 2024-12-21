import { memo } from 'react';
import Image from 'next/image';
import { measurePerformance } from '../../utils/performance';

const DUMMY_IMAGE_URL = 'https://placehold.co/300x300/e5e7eb/a3a3a3?text=No+Image';

interface ProductGridItemProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    status: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  };
  onNavigate: (id: string) => void;
  onAddToCart: (product: any) => void;
}

const ProductGridItem = memo(function ProductGridItem({
  product,
  onNavigate,
  onAddToCart,
}: ProductGridItemProps) {
  const endRender = measurePerformance('ProductGridItem render');

  const statusDisplay = {
    IN_STOCK: { text: 'In Stock', color: 'text-green-600 bg-green-50' },
    OUT_OF_STOCK: { text: 'Out of Stock', color: 'text-red-600 bg-red-50' },
    LOW_STOCK: { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' },
  }[product?.status] || { text: 'Unknown', color: 'text-gray-600 bg-gray-50' };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 w-[300px] overflow-hidden">
      {/* Discount badge - if needed */}
      {product.discount && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {product.discount}% OFF
          </span>
        </div>
      )}

      {/* Image container with hover zoom effect */}
      <div className="relative w-[300px] h-[300px] overflow-hidden bg-gray-100">
        <Image
          src={product.image || DUMMY_IMAGE_URL}
          alt={product.name}
          fill
          className="object-cover object-center transform group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
          sizes="300px"
        />
        
        {/* Quick action overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onNavigate(product.id)}
            className="bg-white text-gray-900 p-2 rounded-full m-2 hover:bg-gray-100 transform hover:scale-110 transition-all duration-200"
            aria-label="Quick view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content container */}
      <div className="p-4 h-[150px] flex flex-col justify-between">
        {/* Product details */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer truncate flex-1">
              {product.name}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ml-2 ${statusDisplay.color}`}>
              {statusDisplay.text}
            </span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {product.description}
          </p>
        </div>

        {/* Price and action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-lg 
                     hover:bg-blue-700 transform hover:scale-105 
                     transition-all duration-200 focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductGridItem;
