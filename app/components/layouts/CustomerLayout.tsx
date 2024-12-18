// app/components/layouts/CustomerLayout.tsx
import { ReactNode, useState } from "react";
import Link from "next/link";
import { cn } from "../../../lib/utils";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import CartDropdown from "../CartDropdown";
import UserMenu from "../UserMenu";

interface CustomerLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function CustomerLayout({
  children,
  className,
}: CustomerLayoutProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { cart } = useCart();

  const cartItemCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and primary navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-800">
                  Your Logo
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-gray-300"
                >
                  Products
                </Link>
                <Link
                  href="/quotations"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-gray-300"
                >
                  Quotations
                </Link>
              </div>
            </div>

            {/* User menu and cart */}
            <div className="flex items-center">
              <CartDropdown />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={cn("flex-grow", className)}>{children}</main>
    </div>
  );
}
