"use client";

import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { formatPrice } from "../../lib/utils";

export default function CartMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, cartTotal, itemCount } =
    useCart();

  const handleUpdateQuantity = (
    productId: string,
    action: "increase" | "decrease"
  ) => {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      const newQuantity =
        action === "increase"
          ? item.quantity + 1
          : Math.max(0, item.quantity - 1);

      if (newQuantity === 0) {
        removeFromCart(productId);
      } else {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="relative">
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
            {itemCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pr-6">
          {cartItems.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <li
                  key={`${item.id}-${item.name}`}
                  className="flex items-center space-x-4"
                >
                  <div className="relative h-20 w-20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.price)}
                    </p>

                    <div className="mt-2 flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, "decrease")
                        }
                        className="rounded-md p-1 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, "increase")
                        }
                        className="rounded-md p-1 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 rounded-md p-1 hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between text-base font-medium">
              <p>Subtotal</p>
              <p>{formatPrice(cartTotal)}</p>
            </div>
            <button className="mt-4 w-full rounded-md bg-black py-2 text-white hover:bg-gray-800">
              Checkout
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
