// app/components/layouts/CustomerLayout.tsx
import { ReactNode, useState } from "react";
import { cn } from "../../../lib/utils";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useCart } from "../../context/CartContext";
import CartDropdown from "../CartDropdown";
import UserMenu from "../UserMenu";
import Link from "next/link";
import { memo } from "react";
import MobileNav from "../MobileNav";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Quotations", href: "/quotations" },
];

interface CustomerLayoutProps {
  children: ReactNode;
  className?: string;
}

const CustomerLayout = memo(function CustomerLayout({
  children,
  className,
}: CustomerLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50 will-change-transform">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and primary navigation */}
            <div className="flex flex-1">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-800">
                  Your Logo
                </Link>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop User menu and cart */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <CartDropdown />
              <UserMenu />
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigation}
      />

      {/* Main Content */}
      <main className={cn("flex-grow", className)}>{children}</main>
    </div>
  );
});

export default CustomerLayout;