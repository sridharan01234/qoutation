"use client"
import React, { useState } from 'react';

const OrderTracking = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      orderDate: '2024-01-15',
      status: 'In Transit',
      amount: 1299.99,
      items: 3,
      trackingNumber: 'TRK123456789'
    },
    {
        id: 'ORD-002',
        customerName: 'Jane Smith',
        orderDate: '2024-01-16',
        status: 'Delivered',
        amount: 1999.99,
        items: 2,
        trackingNumber: 'TRK987654321'
      },
      {
        id: 'ORD-003',
        customerName: 'Alice Johnson',
        orderDate: '2024-01-17',
        status: 'Processing',
        amount: 1499.99,
        items: 4,
        trackingNumber: 'TRK567890123'
      },
      {
        id: 'ORD-004',
        customerName: 'Bob Brown',
        orderDate: '2024-01-18',
        status: 'Pending',
        amount: 1799.99,
        items: 1,
        trackingNumber: 'TRK345678901'
      },
      {
        id: 'ORD-005',
        customerName: 'Eva Wilson',
        orderDate: '2024-01-19',
        status: 'Cancelled',
        amount: 1599.99,
        items: 5,
        trackingNumber: 'TRK234567890'
      },
      {
        id: 'ORD-006',
        customerName: 'Michael Lee',
        orderDate: '2024-01-20',
        status: 'In Transit',
        amount: 1399.99,
        items: 2,
        trackingNumber: 'TRK789012345'
      },
      {
        id: 'ORD-007',
        customerName: 'Sophia Davis',
        orderDate: '2024-01-21',
        status: 'Delivered',
        amount: 1899.99,
        items: 3,
        trackingNumber: 'TRK890123456'
      },
      {
        id: 'ORD-008',
        customerName: 'David Miller',
        orderDate: '2024-01-22',
        status: 'Processing',
        amount: 1699.99,
        items: 4,
        trackingNumber: 'TRK1234567890'
      },
      {
        id: 'ORD-009',
        customerName: 'Olivia Wilson',
        orderDate: '2024-01-23',
        status: 'Pending',
        amount: 1499.99,
        items: 1,
        trackingNumber: 'TRK2345678901'
      },
      {
        id: 'ORD-010',
        customerName: 'William Taylor',
        orderDate: '2024-01-24',
        status: 'Cancelled',
        amount: 1799.99,
        items: 5,
        trackingNumber: 'TRK3456789012'
      }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Status options for the order
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'in-transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Order Tracking</h2>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Filters and Search Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-col sm:flex-row">
          {/* Status Filter */}
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-2.5">🔍</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.id}</div>
                  <div className="text-sm text-gray-500">{order.trackingNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.customerName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.orderDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${order.amount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button className="text-gray-600 hover:text-gray-900">Track</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results Message */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No orders found matching your criteria
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
