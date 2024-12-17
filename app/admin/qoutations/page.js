"use client"
import Quatations from '../../components/QuotationOverview';
import AdminLayout from "../../components/layouts/AdminLayout";

export default function QuotationOverview() {
  return (
    <>
    <AdminLayout
        title="Quotation Overview"
        subtitle="Manage your quotations"
      >
        <Quatations />
      </AdminLayout>
    </>
  );
}