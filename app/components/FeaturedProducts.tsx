"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProductTag {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  price: number;
  stock: number;
  sku: string;
  image: string | null;
  status: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  weight: number | null;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
  } | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  tags: ProductTag[];
}

export default function FeaturedProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerSlide = 3;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?featured=true");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const nextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + productsPerSlide) % products.length
    );
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - productsPerSlide + products.length) % products.length
    );
  };

  const handleProductClick = (productId: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    router.push(`/products/${productId}`);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Error: {error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">No featured products available.</div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Featured Products
        </h2>
        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous Slide"
            disabled={products.length <= productsPerSlide}
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
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  (currentIndex / products.length) * 100
                }%)`,
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-full md:w-1/3 px-2"
                  style={{
                    display:
                      index >= currentIndex &&
                      index < currentIndex + productsPerSlide
                        ? "block"
                        : "none",
                  }}
                  onClick={(e) => handleProductClick(product.id, e)}
                >
                  <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl cursor-pointer">
                    <div className="relative aspect-square w-full overflow-hidden">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      {product.status !== "IN_STOCK" && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                          {product.status === "OUT_OF_STOCK"
                            ? "Out of Stock"
                            : "Low Stock"}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 text-xl font-semibold">
                        {product.name}
                      </h3>
                      <p className="mb-3 text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-gray-900">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(product.price)}
                        </p>
                        <span className="text-sm text-gray-500">
                          SKU: {product.sku}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm text-gray-500">
                          Category: {product.category.name}
                        </div>
                        {product.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {product.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next Slide"
            disabled={products.length <= productsPerSlide}
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
        </div>
      </div>
    </section>
  );
}
