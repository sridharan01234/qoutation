// components/layouts/OptimizedAdminLayout.tsx
"use client";
import React, { useState, memo, useMemo } from "react";
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CubeIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { OptimizedLink } from '../OptimizedLink';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<any>;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Quotations', href: '/admin/qoutations', icon: DocumentTextIcon },
  { name: 'Customers', href: '/admin/customers', icon: UserGroupIcon },
  { name: 'Products', href: '/admin/products', icon: CubeIcon },
];

// Memoized navigation item component
const NavigationItem = memo(({ item, isActive }: { item: NavigationItem; isActive: boolean }) => (
  <OptimizedLink
    href={item.href}
    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
      isActive
        ? 'bg-gray-100 text-gray-900'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <item.icon
      className={`mr-3 h-6 w-6 flex-shrink-0 ${
        isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
      }`}
    />
    {item.name}
  </OptimizedLink>
));

// Memoized breadcrumb component
const Breadcrumb = memo(({ paths }: { paths: { href: string; label: string }[] }) => (
  <nav className="flex mb-6" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      <li className="inline-flex items-center">
        <OptimizedLink href="/dashboard" className="text-gray-700 hover:text-blue-600">
          Dashboard
        </OptimizedLink>
      </li>
      {paths.map((breadcrumb, index) => (
        <li key={breadcrumb.href}>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <OptimizedLink
              href={breadcrumb.href}
              className={index === paths.length - 1 ? 'text-gray-500' : 'text-gray-700 hover:text-blue-600'}
            >
              {breadcrumb.label}
            </OptimizedLink>
          </div>
        </li>
      ))}
    </ol>
  </nav>
));

const OptimizedAdminLayout = memo(function OptimizedAdminLayout({
  children,
  title,
  subtitle,
  actionButton
}: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Memoize breadcrumbs calculation
  const breadcrumbs = useMemo(() => {
    const paths = pathname.split('/').filter(path => path);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      return { href, label };
    });
  }, [pathname]);

  // Memoize navigation items
  const navigationItems = useMemo(() => 
    navigation.map(item => ({
      ...item,
      isActive: pathname.startsWith(item.href)
    })),
    [pathname]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-xl font-semibold">Admin Panel</span>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigationItems.map((item) => (
              <NavigationItem key={item.name} item={item} isActive={item.isActive} />
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center px-4">
            <span className="text-xl font-semibold">Admin Panel</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigationItems.map((item) => (
              <NavigationItem key={item.name} item={item} isActive={item.isActive} />
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <Breadcrumb paths={breadcrumbs} />
              <div className="space-y-6">{children}</div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} . All rights reserved Sridharan and co.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
});

export default OptimizedAdminLayout;