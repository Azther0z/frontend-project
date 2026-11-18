import type { Metadata } from "next";
import "./globals.css";
import AppNav from "@/components/AppNav";
import NextAuthProvider from "@/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "Equipment Rental System",
  description: "Browse equipment and manage rental requests.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <AppNav />
          <main className="page-shell">{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
