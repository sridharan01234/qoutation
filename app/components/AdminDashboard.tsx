'use client'

import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalQuotations: number;
  activeCustomers: number;
  revenue: number;
  productsByStatus: {
    IN_STOCK: number;
    LOW_STOCK: number;
    OUT_OF_STOCK: number;
    DISCONTINUED: number;
  };
  quotationsByStatus: {
    DRAFT: number;
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
    EXPIRED: number;
    CONVERTED: number;
    CANCELLED: number;
  };
  recentQuotations: Array<{
    id: string;
    quotationNumber: string;
    customer: { name: string };
    status: string;
    totalAmount: number;
    createdAt: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    sku: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return <div>Error loading dashboard data</div>;
  }

  const productStatusData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock', 'Discontinued'],
    datasets: [{
      data: [
        stats.productsByStatus.IN_STOCK,
        stats.productsByStatus.LOW_STOCK,
        stats.productsByStatus.OUT_OF_STOCK,
        stats.productsByStatus.DISCONTINUED
      ],
      backgroundColor: [
        '#4CAF50',
        '#FFC107',
        '#F44336',
        '#9E9E9E'
      ]
    }]
  };

  const quotationStatusData = {
    labels: ['Draft', 'Pending', 'Approved', 'Rejected', 'Expired', 'Converted', 'Cancelled'],
    datasets: [{
      label: 'Quotations by Status',
      data: [
        stats.quotationsByStatus.DRAFT,
        stats.quotationsByStatus.PENDING,
        stats.quotationsByStatus.APPROVED,
        stats.quotationsByStatus.REJECTED,
        stats.quotationsByStatus.EXPIRED,
        stats.quotationsByStatus.CONVERTED,
        stats.quotationsByStatus.CANCELLED
      ],
      backgroundColor: '#3B82F6'
    }]
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Products"
          value={stats.totalProducts}
          icon="📦"
        />
        <MetricCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon="👥"
        />
        <MetricCard
          title="Active Quotations"
          value={stats.totalQuotations}
          icon="📝"
        />
        <MetricCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon="💰"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Product Status Distribution</h3>
          <Pie data={productStatusData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quotations by Status</h3>
          <Bar 
            data={quotationStatusData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Recent Quotations */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Quotations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quotation #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentQuotations.map((quotation) => (
                  <tr key={quotation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {quotation.quotationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {quotation.customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={quotation.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${quotation.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(quotation.createdAt), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Low Stock Products */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Low Stock Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock Level
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {product.stock} units
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const MetricCard = ({ title, value, icon }: { title: string; value: string | number; icon: string }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className="text-2xl mr-4">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{value}</h3>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: 'gray',
      PENDING: 'yellow',
      APPROVED: 'green',
      REJECTED: 'red',
      EXPIRED: 'gray',
      CONVERTED: 'blue',
      CANCELLED: 'red'
    };
    return colors[status as keyof typeof colors] || 'gray';
  };

  const color = getStatusColor(status);
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${color}-100 text-${color}-800`}>
      {status.toLowerCase()}
    </span>
  );
};
