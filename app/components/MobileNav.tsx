// app/components/MobileNav.tsx
"use client";

import { signOut } from 'next-auth/react'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  BellIcon as Notifications,
  UserCircleIcon as Profile,
  ArrowRightOnRectangleIcon as SignOut
} from "@heroicons/react/24/outline";


interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: Array<{ name: string; href: string }>;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, navigation }) => {
  const router = useRouter();

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />

          {/* Menu */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl z-[100] lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-3 text-base font-medium text-gray-900 hover:text-blue-600"
                    onClick={onClose}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-col space-y-6">
                    {/* Mobile notifications button */}
                    <Link
                      href="/notifications"
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <span className="p-2 rounded-full bg-gray-100">
                        <Notifications className="w-5 h-5" />
                      </span>
                      <span>Notifications</span>
                    </Link>
                    
                    {/* Mobile profile section */}
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <span className="p-2 rounded-full bg-gray-100"/>
                        <Profile className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>

                    {/* Sign out button */}
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-gray-100 rounded-md"
                    >
                      <span className="p-2 rounded-full bg-red-100">
                        <SignOut className="w-5 h-5 text-red-600" />
                      </span>
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;