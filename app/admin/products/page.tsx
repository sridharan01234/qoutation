"use client"
import ProductOverview from "@/app/components/ProductOverview";
import AdminLayout from "../../components/layouts/AdminLayout";

export default function ProductPage() {
  return (
    <AdminLayout
      title="Products"
      subtitle="Manage your product catalog"
    >
      <ProductOverview />
    </AdminLayout>
  );
}
