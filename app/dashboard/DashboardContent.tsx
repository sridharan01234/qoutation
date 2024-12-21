import { memo } from 'react';
import { measurePerformance } from '../utils/performance';
import dynamic from 'next/dynamic';

// Dynamically import components that might not be immediately needed
const AdminControls = dynamic(() => import('./AdminControls'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

const ManagerControls = dynamic(() => import('./ManagerControls'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
});

interface DashboardContentProps {
  user: any;
  isAdmin: boolean;
  isManager: boolean;
}

const DashboardContent = memo(function DashboardContent({ 
  user, 
  isAdmin, 
  isManager 
}: DashboardContentProps) {
  const endContentRender = measurePerformance('DashboardContent render');

  return (
    <div className="space-y-8">
      {isAdmin && <AdminControls />}
      {isManager && <ManagerControls />}
      {/* Regular user content */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {/* Add recent activity content */}
      </div>
    </div>
  );
});

export default DashboardContent;