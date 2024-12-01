// components/ProductDetails.js
import React from 'react';

const ProductDetails = ({ product, onBack }) => {
  if (!product) return null;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
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
              src={product.image}
              alt={product.name}
              className="w-full h-full object-center object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400?text=Product+Image"
              }}
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-2 flex items-center">
              <span className="text-2xl text-gray-900">${product.price.toFixed(2)}</span>
              <span className="ml-4 px-2.5 py-0.5 bg-green-100 text-green-800 text-sm font-medium rounded-full">
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
                <span className="ml-2 text-gray-600">({product.rating})</span>
              </div>
            </div>

            {/* Brand */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">Brand</h3>
              <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <p className="mt-1 text-sm text-gray-500">{product.description}</p>
            </div>

            {/* Category */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">Category</h3>
              <p className="mt-1 text-sm text-gray-500 capitalize">{product.category}</p>
            </div>

            {/* Add to Cart Button */}
            <button className="mt-8 w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
