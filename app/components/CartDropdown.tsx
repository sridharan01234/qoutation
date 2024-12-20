// app/components/CartDropdown.tsx
"use client";
import { useState } from "react";
import { FaShoppingCart, FaFileAlt } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cart, removeFromCart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const createQuotation = async () => {
    try {
      if (status === "unauthenticated" || !session?.user?.id) {
        throw new Error("You must be logged in to create a quotation");
      }

      setIsLoading(true);
      setError(null);

      // Calculate values
      const subtotal = getCartTotal();
      const taxRate = 0;
      const taxAmount = subtotal * (taxRate / 100);
      const totalAmount = subtotal + taxAmount;

      // Format items correctly
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: parseInt(String(item.quantity)),
        unitPrice: parseFloat(item.price.toFixed(2)),
        discount: 0,
        tax: 0,
        total: parseFloat((item.price * item.quantity).toFixed(2)),
        notes: null,
      }));

      // Create the payload using only userId
      const payload = {
        userId: session.user.id,
        validUntil: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "DRAFT",
        subtotal: parseFloat(subtotal.toFixed(2)),
        taxRate: parseFloat(taxRate.toFixed(2)),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        discount: 0,
        discountType: null,
        shippingCost: 0,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        currency: "USD",
        paymentTerms: "IMMEDIATE",
        items: items,
        notes: null,
        terms: null,
      };

      console.log("Creating quotation with user ID:", session.user.id);
      console.log("Sending payload:", payload);

      const response = await fetch("/api/quotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.details || "Failed to create quotation"
        );
      }

      // Clear the cart and redirect
      clearCart();
      setIsOpen(false);
      router.push(`/quotations/${result.data.id}`);
    } catch (error: any) {
      console.error("Error creating quotation:", error);
      setError(error.message || "Failed to create quotation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="text-gray-600 hover:text-gray-900 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaShoppingCart size={20} />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {cartItemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Draft Quotation</h3>

            {/* Show login message if not authenticated */}
            {status === "unauthenticated" && (
              <div className="mb-4 p-2 bg-yellow-100 text-yellow-600 rounded">
                Please log in to create a quotation
              </div>
            )}

            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                {error}
              </div>
            )}

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Your draft is empty
              </p>
            ) : (
              <>
                <div className="max-h-96 w-100 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-3 border-b border-gray-100"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between mb-4">
                    <span className="text-base font-medium">Subtotal</span>
                    <span className="text-base font-medium">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={createQuotation}
                    disabled={isLoading || status === "unauthenticated"}
                    className={`w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md 
                      ${
                        isLoading || status === "unauthenticated"
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-700"
                      }
                      flex items-center justify-center gap-2`}
                  >
                    <FaFileAlt />
                    {isLoading ? "Creating..." : "Create Quotation"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default CartDropdown;
