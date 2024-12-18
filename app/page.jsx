"use client";
import React, { useState, useEffect } from "react";
import { fetchProducts } from "./services/api";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FeaturedProducts from "./components/FeaturedProducts";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="relative h-[600px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/hero-image.jpg" // Replace with your hero image
              alt="Hero Background"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Welcome to Our Store
              </h1>
              <p className="text-xl sm:text-2xl mb-8">
                Discover our amazing collection of products
              </p>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
     
      <FeaturedProducts products={products} />
    </div>
  );
};

export default Home;
