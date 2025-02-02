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
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl 
                    transition-all duration-500 w-[320px] overflow-hidden
                    border border-gray-100 hover:border-primary-100">
      {/* Discount badge - if needed */}
      {product.discount && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 
                         text-white px-3 py-1.5 rounded-full text-xs font-semibold
                         shadow-lg shadow-primary-500/20 tracking-wider
                         flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            {product.discount}% OFF
          </span>
        </div>
      )}

      {/* Image container with hover zoom effect */}
      <div className="relative w-[320px] h-[320px] overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
        <Image
          src={product.image || DUMMY_IMAGE_URL}
          alt={product.name}
          fill
          className="object-cover object-center transform group-hover:scale-110 
                     transition-transform duration-700 ease-out"
          loading="lazy"
          sizes="320px"
        />
        
        {/* Quick action overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
                       opacity-0 group-hover:opacity-100 transition-all duration-500
                       flex items-center justify-center">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button
              onClick={() => onNavigate(product.id)}
              className="flex-1 bg-white/90 backdrop-blur-sm text-primary-600 py-2.5 px-4 rounded-xl
                       font-medium text-sm hover:bg-white transition-all duration-300
                       flex items-center justify-center gap-2 hover:shadow-lg"
              aria-label="Quick view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Quick View
            </button>
          </div>
        </div>
      </div>

      {/* Content container */}
      <div className="p-5 flex flex-col gap-4">
        {/* Product details */}
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-base font-semibold text-gray-800 hover:text-primary-600 
                          transition-colors duration-200 cursor-pointer truncate flex-1
                          font-poppins">
              {product.name}
            </h3>
            <span className={`text-xs px-2.5 py-1 rounded-full ${statusDisplay.color} font-medium`}>
              {statusDisplay.text}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 font-inter leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price and action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              {/* <span className="text-xl font-bold text-primary-600 font-poppins">
                ${product.price.toFixed(2)}
              </span> */}
              {/* {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through font-medium">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )} */}
            </div>
            {product.discount && (
              <span className="text-xs text-secondary-600 font-medium">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="relative inline-flex items-center justify-center px-4 py-2.5 
                     overflow-hidden font-medium transition-all duration-300 
                     rounded-xl group bg-gradient-to-r from-primary-500 to-primary-600
                     hover:from-primary-600 hover:to-primary-700 text-white
                     active:scale-95 transform shadow-md hover:shadow-lg"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform rotate-12 
                           translate-x-10 bg-white opacity-10 group-hover:-translate-x-40 ease"></span>
            <span className="relative flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              Add to Cart
            </span>
          </button>
        </div>
      </div>
    </div>
  );

});


export default ProductGridItem;
