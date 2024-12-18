// types/dashboard.ts
import { ProductStatus, QuotationStatus } from "@prisma/client";

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: Date;
  quotationNumber: string;
}

interface TopProduct {
  name: string;
  sku: string;
  totalQuantity: number;
  totalValue: number;
}

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
    user: {
      name: string | null;
      email: string;
    };
    itemCount: number;
    recentActivities: Activity[];
  }>;
  topProducts: TopProduct[];
  recentActivities: Activity[];
  notifications: {
    total: number;
    unread: number;
  };
  attachments: {
    count: number;
    totalSize: number;
  };
}
