"use client";
import React from "react";
import AdminDashboard from "../components/AdminDashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header Section - Full Width */}
      <div className="sticky top-0 z-50 bg-white shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between max-w-[2000px] mx-auto">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your products, orders, and customers
              </p>
            </div>

            {/* Admin Profile/Quick Actions */}
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                New Product
              </button>
              <div className="flex items-center space-x-3">
                <span className="relative">
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white" />
                  <img
                    className="h-10 w-10 rounded-full"
                    src="/admin-avatar.png"
                    alt="Admin"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/40";
                    }}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full h-full grid grid-cols-1">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {/* Breadcrumb */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href="#" className="text-gray-700 hover:text-blue-600">
                    Home
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-500">Dashboard</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Dashboard Content */}
            <div className="space-y-6">
              <AdminDashboard />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} . All rights reserved Sridharan and co.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
