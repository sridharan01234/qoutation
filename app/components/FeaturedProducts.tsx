"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductGridItem from "../components/ProductGridItem";
import {  useCart } from "../context/CartContext";

interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  sku: string;
  image: string | null;
  status: string;
  weight: string;
  dimensions: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  productTags: Array<{
    tag: {
      id: string;
      name: string;
    };
    assignedAt: string;
  }>;
}

interface FeaturedProductsProps {
  productsPerSlide?: number;
}

export default function FeaturedProducts({ 
  productsPerSlide = 4,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { addToCart } = useCart();

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const nextSlide = () => {
    if (isAnimating || products.length <= productsPerSlide) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex + productsPerSlide >= products.length ? 0 : prevIndex + productsPerSlide
    );
  };

  const navigateToProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const prevSlide = () => {
    if (isAnimating || products.length <= productsPerSlide) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex - productsPerSlide < 0 
        ? Math.max(0, products.length - productsPerSlide) 
        : prevIndex - productsPerSlide
    );
  };

  useEffect(() => {
    if (products.length <= productsPerSlide) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, products.length, productsPerSlide]);

  const handleTransitionEnd = () => {
    setIsAnimating(false);
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        No featured products available
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
          Featured Products
          <div className="mt-2 h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
        </h2>
        
        <div className="relative group">
          {products.length > productsPerSlide && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 
                         bg-white/90 p-4 rounded-full shadow-lg
                         hover:bg-blue-500 hover:text-white
                         transition-all duration-300 ease-in-out
                         opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous Slide"
                disabled={currentIndex === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2
                         bg-white/90 p-4 rounded-full shadow-lg
                         hover:bg-blue-500 hover:text-white
                         transition-all duration-300 ease-in-out
                         opacity-0 group-hover:opacity-100 translate-x-4 group-hover:-translate-x-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next Slide"
                disabled={currentIndex + productsPerSlide >= products.length}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          <div className="overflow-hidden rounded-xl shadow-lg">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${(currentIndex * 100) / productsPerSlide}%)`,
                gap: '1rem',
                padding: '1rem'
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / productsPerSlide}% - 1rem)` }}
                >
                  <ProductGridItem
                    product={product}
                    onNavigate={() => navigateToProduct(product.id)}
                    onAddToCart={() => addToCart(product)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
