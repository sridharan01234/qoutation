// components/layouts/OptimizedAdminLayout.tsx
"use client";
import React, { useState, memo, useMemo } from "react";
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CubeIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
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
  { name: 'Quotations', href: '/admin/quotations', icon: DocumentTextIcon },
  { name: 'Customers', href: '/admin/customers', icon: UserGroupIcon },
  { name: 'Products', href: '/admin/products', icon: CubeIcon },
];

// Memoized navigation item component
const NavigationItem = memo(({ item, isActive }: { item: NavigationItem; isActive: boolean }) => (
  <OptimizedLink
    href={item.href}
    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
    }`}
  >
    <item.icon
      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
      }`}
    />
    {item.name}
  </OptimizedLink>
));
NavigationItem.displayName = 'NavigationItem';

// Memoized breadcrumb component
const Breadcrumb = memo(({ paths }: { paths: { href: string; label: string }[] }) => (
  <nav className="flex mb-4" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-2">
      <li className="inline-flex items-center">
        <OptimizedLink 
          href="/admin" 
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          <HomeIcon className="w-4 h-4 mr-2" />
          Home
        </OptimizedLink>
      </li>
      {paths.map((breadcrumb, index) => (
        <li key={breadcrumb.href}>
          <div className="flex items-center">
            <ChevronDownIcon className="w-5 h-5 text-gray-400 rotate-[-90deg]" />
            <OptimizedLink
              href={breadcrumb.href}
              className={`ml-1 text-sm font-medium ${
                index === paths.length - 1
                  ? 'text-blue-600 cursor-default'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {breadcrumb.label}
            </OptimizedLink>
          </div>
        </li>
      ))}
    </ol>
  </nav>
));
Breadcrumb.displayName = 'Breadcrumb';

// Header component
const Header = memo(({ onMenuClick }: { onMenuClick: () => void }) => (
  <header className="bg-white shadow-sm lg:static lg:overflow-y-visible">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative flex h-16 justify-between">
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="-ml-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            onClick={onMenuClick}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
              <BellIcon className="h-6 w-6" />
            </button>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-3 text-sm focus:outline-none">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <span className="hidden md:block font-medium text-gray-700">Admin User</span>
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
));
Header.displayName = 'Header';

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
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <span className="text-xl font-semibold text-gray-800">Admin Panel</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-6">
            {navigationItems.map((item) => (
              <NavigationItem key={item.name} item={item} isActive={item.isActive} />
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <span className="text-xl font-semibold text-gray-800">Admin Panel</span>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-6">
            {navigationItems.map((item) => (
              <NavigationItem key={item.name} item={item} isActive={item.isActive} />
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main Content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          
          <Breadcrumb paths={breadcrumbs} />
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              {actionButton && (
                <div className="mb-6">
                  <button
                    onClick={actionButton.onClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {actionButton.label}
                  </button>
                </div>
              )}
              <div className="space-y-6">{children}</div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Sridharan and co. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
});

OptimizedAdminLayout.displayName = 'OptimizedAdminLayout';

export default OptimizedAdminLayout;
