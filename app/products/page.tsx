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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
              >
                <option value="all">All Categories</option>
                {/* Add your categories dynamically */}
              </select>

              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {!filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-4">No products found</div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
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
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
