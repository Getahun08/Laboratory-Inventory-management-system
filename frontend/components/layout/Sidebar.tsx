"use client";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  Microscope,
  Truck,
  ArrowRightLeft,
  Settings,
  Menu,
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Chemicals", href: "/chemicals", icon: FlaskConical },
  { title: "Equipment", href: "/equipment", icon: Microscope },
  { title: "Suppliers", href: "/suppliers", icon: Truck },
  { title: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg
                   bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300",
          "bg-slate-50 border-r border-blue-100 shadow-sm",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-blue-100">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-700 font-bold text-xl"
            >
              <FlaskConical className="h-6 w-6 text-blue-600" />
              <span>LabManager</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-3">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-5 rounded-xl",
                    "text-base font-semibold transition-all duration-200",
                    isActive
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-blue-100">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full bg-blue-600 text-white
                              flex items-center justify-center font-bold"
              >
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Admin User
                </p>
                <p className="text-xs text-slate-500">admin@lab.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
