// components/LoadingScreen.tsx
import { memo } from 'react';

const LoadingScreen = memo(function LoadingScreen() {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }
)
export default LoadingScreen;
  