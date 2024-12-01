const ProductCard = ({ product }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300?text=Product+Image";
            }}
          />
          {product.stock <= 0 && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
  
        {/* Product Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2 h-12 overflow-hidden">
            {product.description}
          </p>
  
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.stock}
            </span>
          </div>
  
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`h-4 w-4 ${
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
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.rating.toFixed(1)}
            </span>
          </div>
  
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded-full">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
            <span>{product.brand}</span>
          </div>
  
          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
              View Details
            </button>
            <button 
              className={`flex-1 ${
                product.stock > 0 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white py-2 px-4 rounded-md transition-colors duration-200`}
              disabled={product.stock <= 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default ProductCard;