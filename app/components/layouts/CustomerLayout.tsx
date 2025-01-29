// app/components/layouts/CustomerLayout.tsx
import { ReactNode, useState } from "react";
import { cn } from "../../../lib/utils";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useCart } from "../../context/CartContext";
import CartDropdown from "../CartDropdown";
import UserMenu from "../UserMenu";
import Link from "next/link";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Quotations", href: "/quotations" },
];

interface CustomerLayoutProps {
  children: ReactNode;
  className?: string;
}

  {/* Add this component for MobileNav */}
  const MobileNav = ({ isOpen, onClose, navigation }) => (
    <motion.div 
      className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 
                                    bg-clip-text text-transparent">
              Suppliez
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-primary-500 hover:text-primary-700
                       hover:bg-primary-50 transition-all duration-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-base font-medium text-primary-600 
                         rounded-lg hover:bg-primary-50 hover:text-primary-900
                         transition-all duration-300"
                onClick={onClose}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </motion.div>
    </motion.div>
  );

const CustomerLayout = memo(function CustomerLayout({
  children,
  className,
}: CustomerLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
    {/* Navigation */}
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-primary-100 
                 sticky top-0 z-50 will-change-transform transition-all duration-300"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex flex-1">
            <motion.div 
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 
                                      bg-clip-text text-transparent hover:from-primary-700 hover:to-secondary-700
                                      transition-all duration-300">
                Suppliez
              </Link>
            </motion.div>
            
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group inline-flex items-center px-1 pt-1 text-sm font-medium 
                           text-primary-600 transition-all duration-300
                           hover:text-primary-900"
                >
                  {item.name}
                  <motion.div 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r 
                             from-primary-400 to-secondary-400 group-hover:w-full 
                             transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              ))}
            </div>
          </div>
  
          {/* Desktop User menu and cart */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <CartDropdown />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <UserMenu />
            </motion.div>
          </div>
  
          {/* Mobile menu button */}
          <motion.div 
            className="flex items-center md:hidden"
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-lg
                       text-primary-500 hover:text-primary-700
                       hover:bg-primary-50 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  
    {/* Mobile Navigation */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <MobileNav
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            navigation={navigation}
          />
        </motion.div>
      )}
    </AnimatePresence>
  
    {/* Main Content */}
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("flex-grow", className)}
    >
      {children}
    </motion.main>
  </div>
  );
});

export default CustomerLayout;