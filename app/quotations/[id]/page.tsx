// app/quotations/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { QuotationStatus, PaymentTerms } from "@prisma/client";

interface QuotationItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  notes: string | null;
  product: {
    name: string;
    description: string | null;
    image: string | null;
    sku: string;
  };
}

interface Quotation {
  id: string;
  quotationNumber: string;
  userId: string;
  date: string;
  validUntil: string;
  status: QuotationStatus;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  discountType: string | null;
  shippingCost: number;
  totalAmount: number;
  notes: string | null;
  terms: string | null;
  paymentTerms: PaymentTerms;
  currency: string;
  revisionNumber: number;
  items: QuotationItem[];
  user: {
    name: string | null;
    email: string;
  };
}

export default function QuotationPage({ params }: { params: { id: string } }) {
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        if (status === "unauthenticated") {
          router.push("/auth/signin");
          return;
        }

        const response = await fetch(`/api/quotations/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch quotation");
        }

        setQuotation(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchQuotation();
    }
  }, [params.id, status, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="min-h-screen p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-600">
          Quotation not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quotation #{quotation.quotationNumber}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Created by {quotation.user.name || quotation.user.email}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${
                  quotation.status === "DRAFT"
                    ? "bg-gray-100 text-gray-800"
                    : quotation.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : quotation.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : quotation.status === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }
              `}
              >
                {quotation.status}
              </span>
              <p className="text-sm text-gray-500 mt-2">
                Valid until:{" "}
                {new Date(quotation.validUntil).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quotation.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {item.product.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {item.product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-gray-500">
                    {quotation.currency} {item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-gray-900">
                    {quotation.currency} {item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm text-gray-900">
                  {quotation.currency} {quotation.subtotal.toFixed(2)}
                </span>
              </div>
              {quotation.discount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Discount</span>
                  <span className="text-sm text-gray-900">
                    {quotation.currency} {quotation.discount.toFixed(2)}
                  </span>
                </div>
              )}
              {quotation.taxAmount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">
                    Tax ({quotation.taxRate}%)
                  </span>
                  <span className="text-sm text-gray-900">
                    {quotation.currency} {quotation.taxAmount.toFixed(2)}
                  </span>
                </div>
              )}
              {quotation.shippingCost > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Shipping</span>
                  <span className="text-sm text-gray-900">
                    {quotation.currency} {quotation.shippingCost.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="text-base font-medium text-gray-900">
                  Total
                </span>
                <span className="text-base font-medium text-gray-900">
                  {quotation.currency} {quotation.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        {(quotation.notes || quotation.terms) && (
          <div className="p-6 border-t border-gray-200">
            {quotation.notes && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900">Notes</h3>
                <p className="mt-1 text-sm text-gray-500">{quotation.notes}</p>
              </div>
            )}
            {quotation.terms && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Terms</h3>
                <p className="mt-1 text-sm text-gray-500">{quotation.terms}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
