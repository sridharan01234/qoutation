"use client";
import React, { useState, useEffect } from "react";
import ProductGrid from "./components/ProductGrid";
import ProductDetails from "./components/ProductDetails";
import { fetchProducts } from "./services/api";
import CartDropdown from "./components/CartDropdown";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = (product) => {
    // Implement add to cart logic
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = (product) => {
    // Implement favorite toggle logic
    console.log("Toggle favorite:", product);
  };

  // Fetch products when component mounts
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const filteredProducts = products
    .filter(
      (product) =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (product) =>
        selectedCategory === "all" || product.category === selectedCategory
    );

  // Get unique categories from products
  const categories = [
    "all",
    ...new Set(products.map((product) => product.category)),
  ];

  // Handler for viewing product details
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Handler for going back to product list
  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Product Catalog
            </h1>

            <div className="flex items-center gap-6">
              {!selectedProduct && (
                <>
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-2.5">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {/* Cart Dropdown */}
              <CartDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full h-full">
        {selectedProduct ? (
          <ProductDetails
            product={selectedProduct}
            onBack={handleBackToProducts}
          />
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No products found matching your criteria
                </p>
              </div>
            ) : (
              <div>
                <div className="bg-white border-b">
                  <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-sm text-gray-500">
                      Showing {filteredProducts.length}{" "}
                      {filteredProducts.length === 1 ? "product" : "products"}
                    </p>
                  </div>
                </div>

                <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                  <ProductGrid
                    products={filteredProducts} // Now passing the filtered products
                    onProductClick={handleProductClick}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
