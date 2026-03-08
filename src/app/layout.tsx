import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BreederPro - Broiler Breeder Management System",
  description: "Comprehensive management system for broiler breeder farms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
