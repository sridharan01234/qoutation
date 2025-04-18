// app/components/AdminDashboard.tsx
"use client";
import { useEffect, useState } from "react";
import { ProductStatus, QuotationStatus } from "@prisma/client";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Card, Metric, Text, ProgressBar } from "@tremor/react";
import {
  FaBoxOpen,
  FaFileAlt,
  FaUsers,
  FaDollarSign,
  FaDatabase,
  FaBell,
} from "react-icons/fa";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStats {
  summary: {
    totalProducts: number;
    totalQuotations: number;
    totalUsers: number;
    totalStorageUsed: number;
    unreadNotifications: number;
  };
  productsByStatus: {
    [K in ProductStatus]: number;
  };
  quotationsByStatus: {
    [K in QuotationStatus]: number;
  };
  quotationValues: {
    [K in QuotationStatus]: number;
  };
  recentQuotations: Array<{
    id: string;
    quotationNumber: string;
    date: string;
    status: QuotationStatus;
    totalAmount: number;
    currency: string;
    creator: {
      name: string | null;
      email: string;
    };
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
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch dashboard stats");
      }

      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Error loading dashboard data
        </div>
      </div>
    );
  }

  const totalQuotationValue = Object.values(stats.quotationValues).reduce(
    (sum, value) => sum + value,
    0
  );
  const storageUsedGB = stats.summary.totalStorageUsed / (1024 * 1024 * 1024);
  const storageLimit = 10; // 10GB limit example
  const storagePercentage = (storageUsedGB / storageLimit) * 100;

  // Chart configurations
  const productChartData = {
    labels: ["In Stock", "Low Stock", "Out of Stock", "Discontinued"],
    datasets: [
      {
        data: [
          stats.productsByStatus.IN_STOCK || 0,
          stats.productsByStatus.LOW_STOCK || 0,
          stats.productsByStatus.OUT_OF_STOCK || 0,
          stats.productsByStatus.DISCONTINUED || 0,
        ],
        backgroundColor: [
          "#22C55E", // green
          "#F59E0B", // yellow
          "#EF4444", // red
          "#6B7280", // gray
        ],
        borderWidth: 0,
      },
    ],
  };

  const quotationChartData = {
    labels: [
      "Draft",
      "Pending",
      "Approved",
      "Rejected",
      "Expired",
      "Converted",
      "Cancelled",
    ],
    datasets: [
      {
        label: "Number of Quotations",
        data: [
          stats.quotationsByStatus.DRAFT || 0,
          stats.quotationsByStatus.PENDING || 0,
          stats.quotationsByStatus.APPROVED || 0,
          stats.quotationsByStatus.REJECTED || 0,
          stats.quotationsByStatus.EXPIRED || 0,
          stats.quotationsByStatus.CONVERTED || 0,
          stats.quotationsByStatus.CANCELLED || 0,
        ],
        backgroundColor: "#3B82F6",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaBoxOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <Text>Total Products</Text>
                <Metric>{stats.summary.totalProducts}</Metric>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaFileAlt className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <Text>Total Quotations</Text>
                <Metric>{stats.summary.totalQuotations}</Metric>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaUsers className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <Text>Total Users</Text>
                <Metric>{stats.summary.totalUsers}</Metric>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaDollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <Text>Total Value</Text>
                <Metric>
                  $
                  {totalQuotationValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Metric>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaBell className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <Text>Unread Notifications</Text>
                <Metric>{stats.summary.unreadNotifications}</Metric>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FaDatabase className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <Text>Storage Used</Text>
                <Metric>{storageUsedGB.toFixed(2)} GB</Metric>
              </div>
            </div>
            <ProgressBar
              value={storagePercentage}
              color={
                storagePercentage > 90
                  ? "red"
                  : storagePercentage > 70
                  ? "yellow"
                  : "blue"
              }
              className="mt-3"
            />
            <Text className="text-xs text-gray-500 mt-2">
              {storagePercentage.toFixed(1)}% of {storageLimit}GB used
            </Text>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <Text className="mb-4">Products by Status</Text>
            <div className="h-80">
              <Doughnut data={productChartData} options={chartOptions} />
            </div>
          </Card>

          <Card>
            <Text className="mb-4">Quotations by Status</Text>
            <div className="h-80">
              <Bar data={quotationChartData} options={chartOptions} />
            </div>
          </Card>
        </div>

        {/* Recent Quotations */}
        <Card>
          <Text className="mb-4">Recent Quotations</Text>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quotation #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentQuotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quotation.quotationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quotation.creator.name || quotation.creator.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(quotation.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          quotation.status === "DRAFT"
                            ? "bg-gray-100 text-gray-800"
                            : quotation.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : quotation.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : quotation.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : quotation.status === "EXPIRED"
                            ? "bg-orange-100 text-orange-800"
                            : quotation.status === "CONVERTED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {quotation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {quotation.currency} {quotation.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
