// app/quotations/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { QuotationStatus } from "@prisma/client";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaEye,
  FaPlus,
  FaChevronDown,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
  FaEdit
} from "react-icons/fa";
import { toast } from "react-toastify";

interface Quotation {
  id: string;
  quotationNumber: string;
  date: string;
  validUntil: string;
  status: QuotationStatus;
  totalAmount: number;
  currency: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function QuotationsPage() {
  // Initialize quotations as an empty array
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const { data: status } = useSession();
  const router = useRouter();

  const fetchQuotations = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all") params.set("status", statusFilter);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
      params.set("page", pagination.page.toString());
      params.set("limit", pagination.limit.toString());

      const response = await fetch(`/api/quotations?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch quotations");
      }

      setQuotations(data.quotations);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status !== "loading") {
      fetchQuotations();
    }
  }, [status, searchTerm, statusFilter, sortBy, sortOrder, pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

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

  return (
    <div className="min-h-screen bg-secondary-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-700">
              Quotations
            </h1>
            <p className="text-secondary-500 mt-1">
              Manage and track your quotations
            </p>
          </div>
          <button
            onClick={() => router.push("/quotations/new")}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg
            hover:bg-primary-700 transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            shadow-sm hover:shadow-md active:transform active:scale-95"
          >
            <FaPlus className="mr-2 text-sm" />
            Create New Quotation
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 mb-6">
          <div className="p-4 border-b border-secondary-200">
            <h2 className="text-secondary-600 font-medium">Filters</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="relative group">
                <label htmlFor="search" className="sr-only">
                  Search quotations
                </label>
                <FaSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 
                group-focus-within:text-primary-500 transition-colors"
                />
                <input
                  id="search"
                  type="search"
                  placeholder="Search quotations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-secondary-200 rounded-lg
                  focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                  transition-all duration-200 placeholder-secondary-400"
                />
              </div>

              {/* Status Filter */}
              <div className="relative group">
                <label htmlFor="status" className="sr-only">
                  Filter by status
                </label>
                <FaFilter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 
                group-focus-within:text-primary-500 transition-colors"
                />
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 w-full border border-secondary-200 rounded-lg
                  focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                  transition-all duration-200 appearance-none bg-white"
                >
                  <option value="all">All Statuses</option>
                  {Object.values(QuotationStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                <FaChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                text-secondary-400 pointer-events-none"
                />
              </div>

              {/* Sort By */}
              <div className="relative group">
                <label htmlFor="sortBy" className="sr-only">
                  Sort by
                </label>
                <FaSort
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 
                group-focus-within:text-primary-500 transition-colors"
                />
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-2 w-full border border-secondary-200 rounded-lg
                  focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                  transition-all duration-200 appearance-none bg-white"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="quotationNumber">Quotation Number</option>
                  <option value="totalAmount">Total Amount</option>
                </select>
                <FaChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                text-secondary-400 pointer-events-none"
                />
              </div>

              {/* Sort Order */}
              <div className="relative group">
                <label htmlFor="sortOrder" className="sr-only">
                  Sort order
                </label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "asc" | "desc")
                  }
                  className="pl-4 pr-8 py-2 w-full border border-secondary-200 rounded-lg
                  focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                  transition-all duration-200 appearance-none bg-white"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
                <FaChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                text-secondary-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Quotation Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {quotations.map((quotation) => (
                  <tr
                    key={quotation.id}
                    className="hover:bg-secondary-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-700">
                      {quotation.quotationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {new Date(quotation.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          quotation.status === "DRAFT"
                            ? "bg-secondary-100 text-secondary-800"
                            : quotation.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : quotation.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {quotation.status.charAt(0).toUpperCase() +
                          quotation.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700 text-right">
                      {quotation.currency} {quotation.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/quotations/${quotation.id}`)
                          }
                          className="inline-flex items-center p-2 text-secondary-500 hover:text-primary-600 
                    hover:bg-primary-50 rounded-lg transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                          title="View Details"
                        >
                          <span className="sr-only">View Details</span>
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/quotations/${quotation.id}/edit`)
                          }
                          className="inline-flex items-center p-2 text-secondary-500 hover:text-primary-600 
                    hover:bg-primary-50 rounded-lg transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                          title="Edit Quotation"
                        >
                          <span className="sr-only">Edit Quotation</span>
                          <FaEdit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-secondary-600">
            Showing{" "}
            <span className="font-medium">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span> results
          </div>
          <nav className="flex items-center space-x-1" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-md border border-secondary-200 bg-white text-secondary-500
              hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200"
            >
              <span className="sr-only">Previous page</span>
              <FaChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    pagination.page === page
                      ? "bg-primary-600 text-white"
                      : "border border-secondary-200 bg-white text-secondary-700 hover:bg-secondary-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-md border border-secondary-200 bg-white text-secondary-500
              hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200"
            >
              <span className="sr-only">Next page</span>
              <FaChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
