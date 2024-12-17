// app/admin/page.tsx
"use client";
import React from "react";
import AdminLayout from "../components/layouts/AdminLayout";
import AdminDashboard from "../components/AdminDashboard";

const Dashboard = () => {
  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Manage your products, orders, and customers"
      actionButton={{
        label: "New Product",
        onClick: () => window.location.href = '/products/new'
      }}
    >
      <AdminDashboard />
    </AdminLayout>
  );
};

export default Dashboard;
