// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Poppins, Playfair_Display } from 'next/font/google';
import Providers from './providers/Providers';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


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
      <ToastContainer position="top-right" autoClose={3000} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
