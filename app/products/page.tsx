"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaFilter } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useDebounce, useInfiniteScroll } from "../hooks/useOptimizations";
import { useCart } from "../context/CartContext";

const ProductGridItem = dynamic(
  () => import("../components/optimized/ProductGridItem"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
    ),
  }
);

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  status: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  stock: number;
  sku: string;
  category: {
    name: string;
  };
}

export default function CustomerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { cart, addToCart, removeFromCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [category] = useState("");

  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState("featured");

  // Add pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;

  // Infinite scroll reference
  const loadMoreRef = useInfiniteScroll(() => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  });

  const navigateToProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const sortProducts = (products: any) => {
    switch (selectedSort) {
      case "price-asc":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...products].sort((a, b) => b.price - a.price);
      case "name":
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products;
    }
  };

  // Dynamically import ProductGridItem with loading state
  const DynamicProductGridItem = dynamic(
    () => import("../components/ProductGridItem"),
    {
      loading: () => (
        <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
      ),
    }
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [debouncedSearchQuery, selectedCategory, selectedSort]);

  // Update your fetchProducts function
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setProducts(result.data);
        setFilteredProducts(result.data);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  interface Product {
    name: string;
    description: string;
    category: {
      name: string;
    };
    // Add other product properties as needed
  }

  const filterProducts = useCallback(() => {
    if (!Array.isArray(products)) return;

    try {
      let filtered = [...products] as Product[];

      // Search filter
      if (debouncedSearchQuery) {
        filtered = filtered.filter(
          (product: Product) =>
            product?.name
              ?.toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase()) ||
            product?.description
              ?.toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
        );
      }

      // Category filter
      if (selectedCategory && selectedCategory !== "all") {
        filtered = filtered.filter(
          (product: Product) => product?.category?.name === selectedCategory
        );
      }

      // Apply sorting
      filtered = sortProducts(filtered);
      setFilteredProducts(filtered);
    } catch (error) {
      console.error("Error filtering products:", error);
      setFilteredProducts([]);
    }
  }, [products, debouncedSearchQuery, selectedCategory, sortProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center py-10 text-red-500 bg-red-50 px-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-primary-700 mb-2">
            Our Products
          </h1>
          <p className="text-secondary-600 font-inter">
            Discover our curated collection of premium items
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white backdrop-blur-md bg-opacity-90 rounded-2xl shadow-lg p-6 mb-8
                      border border-primary-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-md group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 rounded-xl
                         bg-primary-50/50 border-primary-200
                         focus:bg-white focus:outline-none focus:border-primary-500
                         transition-all duration-300 font-inter"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 
                                 text-primary-400 group-hover:text-primary-600
                                 transition-colors duration-200" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none px-4 py-3.5 pr-10 border-2 rounded-xl
                           bg-secondary-50/50 border-secondary-200
                           focus:border-secondary-500 focus:outline-none
                           min-w-[180px] font-inter transition-all duration-300
                           cursor-pointer hover:bg-secondary-100/50"
                >
                  <option value="all">All Categories</option>
                  {/* Add your categories dynamically */}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 
                              text-secondary-500 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="appearance-none px-4 py-3.5 pr-10 border-2 rounded-xl
                           bg-secondary-50/50 border-secondary-200
                           focus:border-secondary-500 focus:outline-none
                           min-w-[180px] font-inter transition-all duration-300
                           cursor-pointer hover:bg-secondary-100/50"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 
                              text-secondary-500 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {!filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="text-primary-400 text-xl mb-4 font-poppins">
              No products found
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium
                       text-primary-600 hover:text-white border-2 border-primary-500
                       rounded-lg hover:bg-primary-500 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-primary-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortProducts(filteredProducts)
              .slice(0, page * ITEMS_PER_PAGE)
              .map((product: any) => (
                <ProductGridItem
                  key={product.id}
                  product={product}
                  onNavigate={navigateToProduct}
                  onAddToCart={addToCart}
                />
              ))}
            {hasMore && (
              <div
                ref={loadMoreRef}
                className="col-span-full flex justify-center p-4"
              >
                <div className="animate-spin rounded-full h-10 w-10 border-4 
                              border-primary-200 border-t-primary-600"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
