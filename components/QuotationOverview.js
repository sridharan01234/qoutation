// components/QuotationOverview.js
import React, { useState } from 'react';

const QuotationOverview = () => {
  // Sample quotation data
  const [quotations] = useState([
    {
      id: "QT-2024-001",
      customerName: "Tech Solutions Inc.",
      date: "2024-01-15",
      amount: 5250.00,
      items: 8,
      status: "Pending",
      validUntil: "2024-02-15",
      assignedTo: "Sarah Wilson"
    },
    {
      id: "QT-2024-002",
      customerName: "Global Traders Ltd",
      date: "2024-01-14",
      amount: 3750.50,
      items: 5,
      status: "Approved",
      validUntil: "2024-02-14",
      assignedTo: "Mike Johnson"
    },
    {
      id: "QT-2024-003",
      customerName: "Retail Masters",
      date: "2024-01-13",
      amount: 2100.75,
      items: 3,
      status: "Rejected",
      validUntil: "2024-02-13",
      assignedTo: "Emily Brown"
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredQuotations = filterStatus === 'all' 
    ? quotations 
    : quotations.filter(quote => quote.status.toLowerCase() === filterStatus);

  const getStatusColor = (status) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">Quotations</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track customer quotations
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Quotation
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${filterStatus === status
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotation ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuotations.map((quotation) => (
              <tr key={quotation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-600">{quotation.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{quotation.customerName}</div>
                  <div className="text-sm text-gray-500">Assigned to: {quotation.assignedTo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{quotation.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${quotation.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{quotation.items}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(quotation.status)}`}>
                    {quotation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{quotation.validUntil}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-500">Total Quotations</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">{quotations.length}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-yellow-800">Pending</div>
          <div className="mt-1 text-2xl font-semibold text-yellow-900">
            {quotations.filter(q => q.status === 'Pending').length}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-800">Approved</div>
          <div className="mt-1 text-2xl font-semibold text-green-900">
            {quotations.filter(q => q.status === 'Approved').length}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-red-800">Rejected</div>
          <div className="mt-1 text-2xl font-semibold text-red-900">
            {quotations.filter(q => q.status === 'Rejected').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationOverview;
