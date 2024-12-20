"use client";
import "./globals.css";
import { Inter, Poppins, Playfair_Display } from "next/font/google";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-toastify/dist/ReactToastify.css";
import CustomerLayout from "./components/layouts/CustomerLayout";
import AppProviders from "./providers/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${playfair.variable}`}
    >
      <body className={`font-inter antialiased bg-gray-50`}>
        <AppProviders>
          <CustomerLayout>{children}</CustomerLayout>
        </AppProviders>
      </body>
    </html>
  );
}
