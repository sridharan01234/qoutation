import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from './context/CartContext';
import { Inter, Poppins, Playfair_Display } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: "Quotation",
  description: "Get quality products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${playfair.variable}`}>
      <body className={`font-inter antialiased bg-gray-50`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
