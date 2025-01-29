"use client"
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onProductClick }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onProductClick(product)}
    >
      {/* Product Image Container - Reduced height */}
      <div className="relative h-28 bg-gray-200 rounded-t-lg overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400?text=Product+Image"
          }}
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200"
        >
          <svg
            className={`w-4 h-4 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Quick View Button */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(product);
              }}
              className="px-3 py-1.5 bg-white text-gray-900 rounded-md shadow-md hover:bg-gray-100 transition-colors duration-200 font-poppins text-sm"
            >
              Quick View
            </button>
          </div>
        )}

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-poppins font-medium">
            {Math.round(product.discountPercentage)}% OFF
          </div>
        )}
      </div>

      {/* Product Info - Reduced padding */}
      <div className="p-3">
        <h3 className="font-playfair text-base font-medium text-gray-900 line-clamp-1">
          {product.title}
        </h3>
        <p className="font-inter mt-0.5 text-xs text-gray-500 line-clamp-2">
          {product.description}
        </p>
        
        {/* Rating */}
        <div className="flex items-center mt-1.5">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-3 h-3 ${
                index < Math.floor(product.rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-xs text-gray-500 font-inter">({product.rating})</span>
        </div>

        {/* Price and Stock */}
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="font-poppins text-base font-medium text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="ml-1.5 font-inter text-xs text-gray-500 line-through">
                ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
              </span>
            )}
          </div>
          <span className={`font-inter text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`mt-2 w-full px-3 py-1.5 rounded text-xs font-poppins font-medium transition-colors duration-200
            ${product.stock > 0 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

// Main ProductGrid component
const ProductGrid = ({ products, onProductClick }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    );
  };
  

export default ProductGrid;
