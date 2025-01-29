"use client";
import React, { useState, useEffect } from "react";
import { fetchProducts } from "./services/api";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FeaturedProducts from "./components/FeaturedProducts";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const aboutText = `
Welcome to our business-to-business e-commerce platform, where
simplicity meets efficiency in the complex world of trade.
Driven by a singular idea, we are committed to simplifying and
streamlining supply chain operations for businesses, empowering
them to become more agile and efficient. With decades of
experience in the sector, we possess an in-depth understanding
of procurement challenges and offer unique perspectives to
address your needs effectively. At our core, we believe in
leveraging technology as an enabler. Through automation of
essential processes such as inventory tracking and demand
forecasting, we enable businesses to redirect their focus
towards strategic growth and innovation. Our ultimate goal is to
help our clients thrive in today's dynamic marketplace. Join us
as we embark on a journey to transform the way businesses trade,
making it simpler, more efficient, and ultimately more
profitable for all`;
  const whyChooseUsSection = [
    {
      title: "Quality Products",
      description:
        "We source only the highest quality products from trusted manufacturers.",
      icon: "🏆",
    },
    {
      title: "Competitive Pricing",
      description:
        "Get the best value for your investment with our competitive pricing.",
      icon: "💰",
    },
    {
      title: "Expert Support",
      description:
        "Our team of experts is always ready to assist you with any queries.",
      icon: "👥",
    },
  ];

  const aimText = `              At Suppliez, our primary aim is to empower businesses like yours
              to thrive by freeing up your time and resources. By leveraging our
              platform, you can redirect your focus to what matters most:
              growing your business and satisfying your customers. We understand
              the challenges of managing procurement processes, which is why
              we're dedicated to simplifying and streamlining these operations
              for you. Through our innovative solutions and dedicated support,
              we aim to provide you with the tools and resources necessary to
              achieve your business goals efficiently. Additionally, Suppliez is
              committed to bringing profitability to your sourcing function. By
              leveraging our platform, you can significantly reduce costs
              associated with procurement while ensuring the quality and
              reliability of your supplies. Our goal is to enhance your sourcing
              efficiency and drive bottom-line growth for your business. Partner
              with Suppliez today and experience the difference in your
              procurement operations. Let us help you unlock new levels of
              success and profitability in your business journey.`;

              const whatWeDoText = [];

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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary-900 to-secondary-900 text-white">
          <div className="relative h-[600px] w-full overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="/hero-image.jpg"
                alt="Hero Background"
                className="w-full h-full object-cover opacity-40"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-secondary-900/80" />
            <div className="relative h-full flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center px-4 sm:px-6 lg:px-8"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-100 to-secondary-100">
                  Welcome to Our Store
                </h1>
                <p className="text-xl sm:text-2xl mb-8 text-primary-100">
                  Discover our amazing collection of products
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white 
               px-8 py-3 rounded-lg font-semibold transition-all duration-300
               hover:from-primary-600 hover:to-secondary-600
               shadow-lg hover:shadow-xl"
                >
                  Shop Now
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <FeaturedProducts products={products} />

        {/* About Us Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                About Us
              </h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-1 w-12 rounded-full bg-primary-400"></div>
                <div className="h-1 w-24 rounded-full bg-secondary-400"></div>
                <div className="h-1 w-12 rounded-full bg-primary-400"></div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl shadow-2xl">
                  <img
                    src="/about-image.jpg"
                    alt="About Us"
                    className="w-full transform transition-all duration-500 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 
                    group-hover:opacity-0 transition-opacity duration-500"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <p className="text-gray-700 text-lg leading-relaxed">
                  {aboutText}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                Why Choose Us
              </h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-1 w-12 rounded-full bg-secondary-400"></div>
                <div className="h-1 w-24 rounded-full bg-primary-400"></div>
                <div className="h-1 w-12 rounded-full bg-secondary-400"></div>
              </div>
            </motion.div>

            <motion.div
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {whyChooseUsSection.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-8 rounded-xl shadow-lg 
               border-b-4 border-primary-500 hover:border-secondary-500
               hover:shadow-2xl transition-all duration-300 transform
               bg-gradient-to-br from-white to-primary-50/30"
                >
                  <div
                    className="text-5xl mb-6 bg-gradient-to-r from-primary-500 to-secondary-500 
                    bg-clip-text text-transparent"
                  >
                    {item.icon}
                  </div>
                  <h3
                    className="text-xl font-semibold mb-3 bg-gradient-to-r from-primary-700 to-secondary-700 
                    bg-clip-text text-transparent"
                  >
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        {/* Our Aim Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Our Aim
              </h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-1 w-12 rounded-full bg-primary-400"></div>
                <div className="h-1 w-24 rounded-full bg-secondary-400"></div>
                <div className="h-1 w-12 rounded-full bg-primary-400"></div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] 
           transition-all duration-300 border border-primary-100
           hover:shadow-primary-200/50"
            >
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                {aimText}
              </p>
            </motion.div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
                What We Do
              </h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-1 w-12 rounded-full bg-secondary-400"></div>
                <div className="h-1 w-24 rounded-full bg-primary-400"></div>
                <div className="h-1 w-12 rounded-full bg-secondary-400"></div>
              </div>
            </motion.div>
            <motion.div
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {whatWeDoText.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl 
             transition-all duration-300 border-l-4 border-primary-500
             hover:border-secondary-500 group"
                >
                  <h3
                    className="text-xl font-semibold mb-3 bg-gradient-to-r from-primary-700 to-secondary-700 
                 bg-clip-text text-transparent group-hover:from-secondary-700 group-hover:to-primary-700"
                  >
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Us Section */}
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Contact Us
              </h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-1 w-12 rounded-full bg-primary-400"></div>
                <div className="h-1 w-24 rounded-full bg-secondary-400"></div>
                <div className="h-1 w-12 rounded-full bg-primary-400"></div>
              </div>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent">
                  Get in Touch
                </h3>
                <form className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                 placeholder-transparent transition-all duration-300
                 focus:border-primary-500 focus:outline-none focus:ring-2 
                 focus:ring-primary-200 bg-gray-50 hover:border-secondary-300"
                      placeholder="Name"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 -top-2.5 bg-white px-2 text-sm 
                 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent
                 transition-all duration-300 peer-placeholder-shown:top-3.5 
                 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                 peer-focus:-top-2.5 peer-focus:text-sm"
                    >
                      Name
                    </label>
                  </div>
                  {/* Repeat similar styling for email and message inputs */}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white 
               px-6 py-3 rounded-lg transition-all duration-300
               hover:from-primary-700 hover:to-secondary-700
               shadow-lg hover:shadow-xl font-medium"
                  >
                    Send Message
                  </motion.button>
                </form>
              </motion.div>

              {/* Add similar styling for the contact information side */}
            </div>
          </div>

          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-50">
            <div className="max-w-7xl mx-auto">

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-lg"
                >
                  <h3 className="text-2xl font-semibold mb-8 text-primary-700">
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center p-4 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <span
                        className="w-12 h-12 flex items-center justify-center bg-primary-100 
                           rounded-full text-2xl mr-4"
                      >
                        📍
                      </span>
                      <p className="text-gray-600">
                        Rapid Revolve Ventures, CB-3C Hari Nagar, Delhi
                        Cantonment, New Delhi - 110064
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center p-4 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <span
                        className="w-12 h-12 flex items-center justify-center bg-primary-100 
                           rounded-full text-2xl mr-4"
                      >
                        📞
                      </span>
                      <p className="text-gray-600">+91-9311957721</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center p-4 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <span
                        className="w-12 h-12 flex items-center justify-center bg-primary-100 
                           rounded-full text-2xl mr-4"
                      >
                        ✉️
                      </span>
                      <p className="text-gray-600">Sales@Suppliez.in</p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
