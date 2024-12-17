// components/UserMenu.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { NotificationService } from '../../utils/notificationService';

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Icons component
const Icons = {
  Profile: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Admin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  SignOut: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Notifications: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

export default function UserMenu() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const eventSourceRef = useRef<EventSource | null>(null);

// Fetch initial notifications and setup SSE
useEffect(() => {
  if (session?.user) {
    fetchNotifications();
    const cleanup = setupSSE();
    return () => {
      cleanup?.();
    };
  }
}, [session]);

const fetchNotifications = async () => {
  try {
    const response = await fetch('/api/notifications', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setNotifications(data);
    setUnreadCount(data.filter((n: Notification) => !n.read).length);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    toast.error('Failed to fetch notifications');
  }
};

const setupSSE = () => {
  // Clean up existing connection if any
  if (eventSourceRef.current) {
    eventSourceRef.current.close();
  }

  try {
    const eventSource = new EventSource('/api/notifications');
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Ignore heartbeat messages
        if (data.type === 'heartbeat') return;
        
        // Handle connected message
        if (data.type === 'connected') {
          console.log('Connected to notification service');
          return;
        }

        // Handle actual notification
        setNotifications(prev => {
          // Prevent duplicate notifications
          if (prev.some(n => n.id === data.id)) {
            return prev;
          }
          return [data, ...prev];
        });
        
        setUnreadCount(prev => prev + 1);
        toast.info(data.title);
      } catch (error) {
        console.error('Error processing notification:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
      eventSourceRef.current = null;
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        setupSSE();
      }, 5000);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  } catch (error) {
    console.error('Error setting up SSE:', error);
    return undefined;
  }
};

const markAsRead = async (notificationId: string) => {
  try {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ read: true })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  } catch (error) {
    console.error('Error marking notification as read:', error);
    toast.error('Failed to mark notification as read');
  }
};

  const menuItems = [
    {
      label: 'Profile',
      icon: <Icons.Profile />,
      href: '/profile',
      onClick: () => router.push('/profile')
    },
    {
      label: 'Dashboard',
      icon: <Icons.Dashboard />,
      href: '/dashboard',
      onClick: () => router.push('/dashboard')
    },
    {
      label: 'Settings',
      icon: <Icons.Settings />,
      href: '/settings',
      onClick: () => router.push('/settings')
    },
    ...(session?.user?.role === 'ADMIN' ? [
      {
        label: 'Admin Panel',
        icon: <Icons.Admin />,
        href: '/admin',
        onClick: () => router.push('/admin')
      }
    ] : []),
  ]


  return (
    <div className="relative flex items-center gap-4">
    {/* Notifications Bell */}
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
      >
        <Icons.Notifications />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

        {/* Notifications Dropdown */}
        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No new notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <p className="text-sm text-gray-800">{notification.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200">
                <button
                  onClick={() => router.push('/notifications')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* User Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 focus:outline-none"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-xl text-gray-600">
                  {session?.user?.name?.[0] || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-800">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-500">
              {session?.user?.email}
            </p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <div className="px-4 py-2 border-b border-gray-200 md:hidden">
              <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
              <p className="text-sm text-gray-500 truncate">{session?.user?.email}</p>
            </div>

            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick()
                  setIsOpen(false)
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div className="border-t border-gray-200">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <span className="mr-3 text-red-500">
                  <Icons.SignOut />
                </span>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
