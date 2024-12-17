// components/QuotationOverview.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface Quotation {
  id: string;
  quotationNumber: string;
  customer: {
    name: string;
    company: string;
    address: any;
  };
  items: Array<{
    product: any;
    quantity: number;
    price: number;
  }>;
  status: string;
  createdAt: string;
  assignedTo: {
    name: string;
    email: string;
  };
  attachments: any[];
  activities: any[];
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const QuotationOverview: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  useEffect(() => {
    fetchQuotations();
  }, [searchQuery, filterStatus, dateRange, sortBy, sortOrder, pagination.page]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/quotations', {
        params: {
          search: searchQuery,
          status: filterStatus,
          startDate: format(dateRange.startDate, 'yyyy-MM-dd'),
          endDate: format(dateRange.endDate, 'yyyy-MM-dd'),
          sortBy,
          sortOrder,
          page: pagination.page,
          limit: pagination.limit
        }
      });

      setQuotations(response.data.quotations);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch quotations');
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    setSortOrder(sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc');
    setSortBy(key);
  };

  const handleViewQuotation = (id: string) => {
    window.location.href = `/quotations/${id}`;
  };

  const handleEditQuotation = (id: string) => {
    window.location.href = `/quotations/${id}/edit`;
  };

  const formatDateDisplay = () => {
    return `${format(dateRange.startDate, 'MM/dd/yyyy')} - ${format(dateRange.endDate, 'MM/dd/yyyy')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">Quotations</h3>
          <p className="text-sm text-gray-500 mt-1">
            Total: {pagination.total} quotations
          </p>
        </div>

        <button 
          onClick={() => window.location.href = '/quotations/new'}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          New Quotation
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search quotations..."
          className="border rounded-md p-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <div className="relative">
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="w-full border rounded-md p-2 bg-white text-left flex justify-between items-center"
          >
            <span>{formatDateDisplay()}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDatePickerOpen && (
            <div className="absolute right-0 mt-2 z-50">
              <div className="bg-white rounded-lg shadow-lg p-4 border">
                <DateRangePicker
                  ranges={[{
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                    key: 'selection'
                  }]}
                  onChange={({ selection }) => {
                    setDateRange(selection);
                    setIsDatePickerOpen(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quotations Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: 'quotationNumber', label: 'Quotation ID' },
                { key: 'customer.name', label: 'Customer' },
                { key: 'createdAt', label: 'Date' },
                { key: 'status', label: 'Status' },
                { key: 'assignedTo.name', label: 'Assigned To' }
              ].map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  {column.label}
                  {sortBy === column.key && (
                    <span className="ml-2">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotations.map((quotation) => (
              <tr key={quotation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {quotation.quotationNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {quotation.customer.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {quotation.customer.company}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(quotation.createdAt), 'PP')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quotation.status)}`}>
                    {quotation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {quotation.assignedTo.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewQuotation(quotation.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditQuotation(quotation.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default QuotationOverview;
