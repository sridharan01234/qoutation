"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";

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

export default function ProductDetails() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products?id=${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data.data[0]); // Assuming the API returns an array
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="text-red-600 text-xl font-semibold mb-2">
          {error || "Product not found"}
        </div>
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>→</li>
            <li>
              <Link href="/products" className="hover:text-blue-600">
                Products
              </Link>
            </li>
            <li>→</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image Section */}
            <div className="md:w-1/2 relative">
              <div className="sticky top-0 h-[600px]">
                {product.image ? (
                  <div className="relative h-full group">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg
                      className="w-24 h-24 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                {product.status !== "IN_STOCK" && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg px-4 py-2">
                      <span
                        className={`text-sm font-medium ${
                          product.status === "OUT_OF_STOCK"
                            ? "text-red-600"
                            : "text-orange-600"
                        }`}
                      >
                        {product.status === "OUT_OF_STOCK"
                          ? "Out of Stock"
                          : "Low Stock"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="md:w-1/2 p-8 lg:p-12">
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {product.category.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      SKU: {product.sku}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-baseline space-x-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(product.price)}
                    </span>
                    {product.status === "IN_STOCK" && (
                      <span className="text-sm text-green-600 font-medium">
                        In Stock ({product.stock} available)
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || "No description available"}
                  </p>
                </div>

                {/* Specifications */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Specifications
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {product.weight && (
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Weight
                          </p>
                          <p className="text-gray-900">
                            {Math.round(product.weight)} kg
                          </p>
                        </div>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Dimensions
                          </p>
                          <p className="text-gray-900">
                            {Math.round(product.dimensions.length)}x
                            {Math.round(product.dimensions.width)}x
                            {Math.round(product.dimensions.height)} cm
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Tags
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="space-y-4">
                  <button
                    className={`w-full py-4 px-8 rounded-lg text-white font-medium transition-all duration-200
                      ${
                        product.status === "IN_STOCK"
                          ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    disabled={product.status !== "IN_STOCK"}
                  >
                    {product.status === "IN_STOCK"
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>

                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Last updated:{" "}
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}