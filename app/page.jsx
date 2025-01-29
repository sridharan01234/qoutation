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
              for you.Additionally, Suppliez is committed to bringing profitability to your sourcing function. By
              leveraging our platform, you can significantly reduce costs
              associated with procurement while ensuring the quality and
              reliability of your supplies. Our goal is to enhance your sourcing
              efficiency and drive bottom-line growth for your business. Partner
              with Suppliez today and experience the difference in your
              procurement operations.`;

  const whatWeDoText = [
    {
      title: "Inventory Management",
      description:
        "Efficiently manage your inventory with our advanced inventory management system.",
      icon: "📦",
    },
    {
      title: "Order Processing",
      description:
        "Streamline your order processing with our efficient order processing system.",
      icon: "🛒",
    },
    {
      title: "Supply Chain Optimization",
      description:
        "Optimize your supply chain operations with our advanced supply chain optimization tools.",
      icon: "🚚",
    },
    {
      title: "Data Analytics",
      description:
        "Gain valuable insights into your business with our data analytics capabilities.",
      icon: "📊",
    },
  ];

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
          <div className="relative min-h-[80vh] w-full overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1586528116493-d1f6ad380b33"
                alt="Supply Chain Management"
                className="w-full h-full object-cover opacity-40"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-secondary-900/90" />

            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-100 to-secondary-100 leading-tight">
                      Revolutionizing Your Supply Chain Management
                    </h1>
                    <p className="text-xl sm:text-2xl mb-8 text-primary-100/90 leading-relaxed">
                      Transform your procurement process with our innovative
                      solutions. Streamline operations, reduce costs, and drive
                      business growth.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white 
                         px-8 py-4 rounded-lg font-semibold transition-all duration-300
                         hover:from-primary-600 hover:to-secondary-600
                         shadow-lg hover:shadow-xl"
                      >
                        Get Started
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/10 backdrop-blur-sm text-white 
                         px-8 py-4 rounded-lg font-semibold transition-all duration-300
                         hover:bg-white/20 border border-white/30
                         shadow-lg hover:shadow-xl"
                      >
                        Learn More
                      </motion.button>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                      >
                        <h3 className="text-2xl font-bold text-primary-100">
                          500+
                        </h3>
                        <p className="text-white/80">Suppliers</p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                      >
                        <h3 className="text-2xl font-bold text-primary-100">
                          98%
                        </h3>
                        <p className="text-white/80">Success Rate</p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                      >
                        <h3 className="text-2xl font-bold text-primary-100">
                          24/7
                        </h3>
                        <p className="text-white/80">Support</p>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:block"
                  >
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur-xl" />
                      <img
                        src="https://images.unsplash.com/photo-1416339684178-3a239570f315"
                        alt="Supply Chain Analytics"
                        className="relative rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg
                className="w-full h-20 fill-current text-white/5"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
              </svg>
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
                <div className="relative overflow-hidden rounded-xl shadow-2xl group">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
                    alt="Supply Chain Management"
                    className="w-full h-[400px] object-cover transform transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 group-hover:opacity-0 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white text-xl font-semibold">
                      Modern Supply Chain Solutions
                    </h3>
                    <p className="text-white/80 mt-2">
                      Optimizing logistics and distribution networks
                    </p>
                  </div>
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
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
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

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1494961104209-3c223057bd26"
                    alt="Supply Chain Management"
                    className="w-full h-[600px] object-cover transform transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/40 to-secondary-500/40 group-hover:opacity-0 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-8 transform transition-all duration-500">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Streamlined Procurement Solutions
                    </h3>
                    <p className="text-white/90 text-lg">
                      Empowering your business with efficient sourcing and
                      supply chain management
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300 border border-primary-100 hover:shadow-primary-200/50"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-1 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full" />
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      Our Commitment
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                    {aimText}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-block mt-6"
                  >
                    <div className="flex items-center gap-2 text-primary-600 font-semibold">
                      <span>Learn More</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
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
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
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
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent">
                  Get in Touch
                </h3>
                <form
                  className="space-y-6"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      required
                      className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                       placeholder-transparent transition-all duration-300
                       focus:border-primary-500 focus:outline-none focus:ring-2 
                       focus:ring-primary-200 bg-gray-50 hover:border-secondary-300"
                      placeholder="Name"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 -top-2.5 bg-white px-2 text-sm 
                       text-gray-600 transition-all duration-300
                       peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base
                       peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 
                       peer-focus:text-sm peer-focus:text-primary-600"
                    >
                      Name
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      required
                      className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                       placeholder-transparent transition-all duration-300
                       focus:border-primary-500 focus:outline-none focus:ring-2 
                       focus:ring-primary-200 bg-gray-50 hover:border-secondary-300"
                      placeholder="Email"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 -top-2.5 bg-white px-2 text-sm 
                       text-gray-600 transition-all duration-300
                       peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base
                       peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 
                       peer-focus:text-sm peer-focus:text-primary-600"
                    >
                      Email
                    </label>
                  </div>

                  <div className="relative">
                    <textarea
                      id="message"
                      required
                      rows={4}
                      className="peer w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                       placeholder-transparent transition-all duration-300
                       focus:border-primary-500 focus:outline-none focus:ring-2 
                       focus:ring-primary-200 bg-gray-50 hover:border-secondary-300"
                      placeholder="Message"
                    />
                    <label
                      htmlFor="message"
                      className="absolute left-4 -top-2.5 bg-white px-2 text-sm 
                       text-gray-600 transition-all duration-300
                       peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base
                       peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 
                       peer-focus:text-sm peer-focus:text-primary-600"
                    >
                      Message
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 
                     text-white px-6 py-3 rounded-lg transition-all duration-300
                     hover:from-primary-700 hover:to-secondary-700
                     shadow-lg hover:shadow-xl font-medium"
                  >
                    Send Message
                  </motion.button>
                </form>
              </motion.div>

              {/* Contact Information */}
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
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
