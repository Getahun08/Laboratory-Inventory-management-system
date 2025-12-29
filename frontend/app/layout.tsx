// app/layout.tsx
"use client";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import Providers from "@/components/Providers";

import "./styles/globals.css";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Lab Inventory Management",
//   description: "Laboratory Inventory Management System Admin Dashboard",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Do not show sidebar on login page (or any auth-free page)
  const showSidebar = !["/login", "/signup"].includes(pathname);

  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "bg-background min-h-screen antialiased"
        )}
      >
        <Providers>
          <div className="flex min-h-screen">
            {showSidebar && <Sidebar />}
            <main
              className={cn(
                "flex-1 p-8 overflow-y-auto h-screen",
                showSidebar ? "md:ml-64" : ""
              )}
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
