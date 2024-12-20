// app/context/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../types";
import { toast } from "react-toastify";
import Link from "next/link";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// Initialize with default values
const defaultCartContext: CartContextType = {
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
};

export const CartContext = createContext<CartContextType>(defaultCartContext);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // Find the current quantity of the item in the cart
    const currentQuantity = cart.find(item => item.id === product.id)?.quantity || 1;

    toast(
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="h-10 w-10 rounded-md object-cover border border-gray-100"
          />
          {currentQuantity > 1 && (
            <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-500 text-white text-xs font-medium flex items-center justify-center">
              {currentQuantity}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900">Added to Cart</div>
          <div className="text-sm text-gray-500 truncate pr-2">
            {product.name}
          </div>
        </div>
        <Link
          href="/cart"
          className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          View
        </Link>
      </div>
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter((item) => item.id !== productId);
    });
    toast.success("Product removed from cart");
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
