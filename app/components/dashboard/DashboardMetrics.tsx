import React, { memo } from 'react';
import { measurePerformance } from '../../utils/performance';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

const MetricCard = memo(function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p className={`mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
});

const DashboardMetrics = memo(function DashboardMetrics() {
  // Performance measurement
  const endMetricsRender = measurePerformance('DashboardMetrics render');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Orders"
        value="156"
        change={12}
      />
      <MetricCard
        title="Total Revenue"
        value="$45,231"
        change={8}
      />
      <MetricCard
        title="Active Users"
        value="2,345"
        change={-3}
      />
      <MetricCard
        title="Conversion Rate"
        value="3.2%"
        change={0.8}
      />
    </div>
  );
});

export default DashboardMetrics;