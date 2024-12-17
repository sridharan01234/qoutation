"use client"
import CustomersOverview from "@/app/components/CustomerOverview";
import AdminLayout from "../../components/layouts/AdminLayout";

export default function Customers() {
  return (
    <AdminLayout
    title="Products"
    subtitle="Manage your product catalog"
  >
    <div className="flex flex-col gap-4">
      <CustomersOverview />
    </div>
    </AdminLayout>

  );
}