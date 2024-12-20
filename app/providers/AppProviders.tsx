"use client"

import { CartProvider } from "../context/CartContext";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <CartProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        {children}
      </CartProvider>
    </SessionProvider>
  );
}