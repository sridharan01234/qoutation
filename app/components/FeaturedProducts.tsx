"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductGridItem from "../components/ProductGridItem";
import { useCart } from "../context/CartContext";

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

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products?featured=true");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
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
      prevIndex + productsPerSlide >= products.length
        ? 0
        : prevIndex + productsPerSlide
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
      <div className="py-16 text-center bg-gradient-to-b from-primary-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-primary-200 border-t-primary-600 
                   rounded-full mx-auto"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center bg-red-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
        >
          <span className="text-3xl mb-4 block">⚠️</span>
          {error}
        </motion.div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-primary-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-primary-600 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
        >
          <span className="text-3xl mb-4 block">📦</span>
          No featured products available
        </motion.div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 
                          bg-clip-text text-transparent mb-6"
          >
            Featured Products
          </h2>
          <div className="flex items-center justify-center gap-3">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "2rem" }}
              className="h-1 rounded-full bg-primary-400"
            />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "4rem" }}
              className="h-1 rounded-full bg-secondary-400"
            />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "2rem" }}
              className="h-1 rounded-full bg-primary-400"
            />
          </div>
        </motion.div>

        <div className="relative group">
          <AnimatePresence>
            {products.length > productsPerSlide && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05, x: 5 }}
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 z-10 -translate-y-1/2 
                             bg-gradient-to-r from-primary-500 to-primary-600
                             text-white p-3 rounded-full shadow-lg
                             transition-all duration-300 ease-out
                             opacity-0 group-hover:opacity-100 -translate-x-4 
                             group-hover:translate-x-2 hover:shadow-primary-400/30
                             focus:outline-none focus:ring-2 focus:ring-primary-400
                             disabled:opacity-50 disabled:cursor-not-allowed
                             backdrop-blur-sm"
                  disabled={currentIndex === 0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05, x: -5 }}
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 z-10 -translate-y-1/2
                             bg-gradient-to-l from-secondary-500 to-secondary-600
                             text-white p-3 rounded-full shadow-lg
                             transition-all duration-300 ease-out
                             opacity-0 group-hover:opacity-100 translate-x-4 
                             group-hover:-translate-x-2 hover:shadow-secondary-400/30
                             focus:outline-none focus:ring-2 focus:ring-secondary-400
                             disabled:opacity-50 disabled:cursor-not-allowed
                             backdrop-blur-sm"
                  disabled={currentIndex + productsPerSlide >= products.length}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                </motion.button>
              </>
            )}
          </AnimatePresence>

          <motion.div
            className="overflow-hidden rounded-xl shadow-lg bg-white/80 backdrop-blur-sm
                         border border-primary-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${
                  (currentIndex * 100) / productsPerSlide
                }%)`,
                gap: "1rem",
                padding: "1rem",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / productsPerSlide}% - 1rem)` }}
                  whileHover={{ scale: 1.02 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  <ProductGridItem
                    product={product}
                    onNavigate={() => navigateToProduct(product.id)}
                    onAddToCart={() => addToCart(product)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6 gap-1.5">
            {Array.from({
              length: Math.ceil(products.length / productsPerSlide),
            }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index * productsPerSlide)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / productsPerSlide) === index
                    ? "w-6 bg-primary-500"
                    : "w-1.5 bg-gray-300 hover:bg-primary-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
