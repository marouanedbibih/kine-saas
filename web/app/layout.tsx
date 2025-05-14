import Providers from "@/lib/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MedixPro - Clinic Management System",
  description: "Modern clinic management system for healthcare professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          richColors
          position="top-right"
          closeButton
          toastOptions={{
            duration: 4000,
            className: "my-toast-class",
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
