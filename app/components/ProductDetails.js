// components/ProductDetails.js
"use client"
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductDetails = ({ product, onBack }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-poppins"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={product.thumbnail || product.image}
              alt={product.title || product.name}
              className="w-full h-full object-center object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400?text=Product+Image"
              }}
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="font-playfair text-3xl font-bold text-gray-900">
              {product.title || product.name}
            </h1>
            
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-poppins text-2xl text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="ml-2 font-inter text-sm text-gray-500 line-through">
                    ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
                  </span>
                )}
              </div>
              <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-sm font-poppins font-medium rounded-full">
                In Stock: {product.stock}
              </span>
            </div>

            {/* Rating */}
            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${
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
                <span className="ml-2 font-inter text-gray-600">({product.rating})</span>
              </div>
            </div>

            {/* Brand */}
            <div className="mt-4">
              <h3 className="font-poppins text-sm font-medium text-gray-900">Brand</h3>
              <p className="mt-1 font-inter text-sm text-gray-500">{product.brand}</p>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="font-poppins text-sm font-medium text-gray-900">Description</h3>
              <p className="mt-1 font-inter text-sm text-gray-500">{product.description}</p>
            </div>

            {/* Category */}
            <div className="mt-4">
              <h3 className="font-poppins text-sm font-medium text-gray-900">Category</h3>
              <p className="mt-1 font-inter text-sm text-gray-500 capitalize">{product.category}</p>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6">
              <h3 className="font-poppins text-sm font-medium text-gray-900">Quantity</h3>
              <div className="mt-2 flex items-center">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 border rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <span className="px-4 py-2 border-t border-b font-poppins">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="p-2 border rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="mt-8 w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
