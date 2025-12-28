"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FlaskConical,
  Microscope,
  Truck,
  AlertTriangle,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface Stat {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  color?: string;
}

interface Transaction {
  id: number;
  chemicalName: string;
  type: string;
  quantity: number;
  timestamp: string;
}

interface LowStockItem {
  id: number;
  name: string;
  quantity: number;
  minQuantity: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://localhost:8081";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    async function fetchDashboardData() {
      try {
        const statsRes = await axios.get(`${API_BASE}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("DASHBOARD STATS RESPONSE:", statsRes.data);
        setStats([
          {
            title: "Total Chemicals",
            value: statsRes.data.totalChemicals ?? 0,
            icon: FlaskConical,
            description: "In stock",
          },
          {
            title: "Equipment Items",
            value: statsRes.data.equipmentItems ?? 0,
            icon: Microscope,
            description: "Active units",
          },
          {
            title: "Low Stock Alerts",
            value: statsRes.data.lowStockAlerts ?? 0,
            icon: AlertTriangle,
            description: "Items require reordering",
            color: "text-destructive",
          },
          {
            title: "Active Suppliers",
            value: statsRes.data.activeSuppliers ?? 0,
            icon: Truck,
            description: "Registered partners",
          },
        ]);

        const txRes = await axios.get(
          `${API_BASE}/api/dashboard/transactions/recent`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(Array.isArray(txRes.data) ? txRes.data : []);

        const lowStockRes = await axios.get(
          `${API_BASE}/api/dashboard/stock/low`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLowStock(Array.isArray(lowStockRes.data) ? lowStockRes.data : []);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        router.replace("/dashboard");
      }
    }

    fetchDashboardData();
  }, [router, API_BASE]);

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className=" mt-1 text-blue-800">
            Welcome back, Admin. Here’s your laboratory inventory overview.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white shadow"
          >
            <Link href="/chemicals/new">
              <Plus className="h-4 w-4 mr-2" /> Add Chemical
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Link href="/transactions">View Reports</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative border border-blue-100 shadow-sm hover:shadow-md transition"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600">
                {stat.title}
              </CardTitle>

              <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <stat.icon
                  className={`h-5 w-5 ${
                    stat.color ? stat.color : "text-blue-600"
                  }`}
                />
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stat.value}
              </div>
              <p className="text-sm text-slate-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Transactions */}
        <Card className="lg:col-span-4 border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Latest chemical inventory movements
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {transactions.length ? (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg
                           border border-blue-100 bg-white px-4 py-3
                           hover:bg-blue-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FlaskConical className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {tx.chemicalName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {tx.type} • Qty {tx.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-800">
                      {tx.quantity}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No transactions found.</p>
            )}

            <Button
              asChild
              variant="ghost"
              className="w-full text-blue-600 hover:bg-blue-50"
            >
              <Link href="/transactions">
                View All Transactions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="lg:col-span-3 border-red-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-600">Low Stock Alerts</CardTitle>
            <CardDescription>Items below minimum quantity</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {lowStock.length ? (
              lowStock.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between
                           rounded-lg border border-red-100 bg-red-50 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-600">
                        Qty {item.quantity} (Min {item.minQuantity})
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-100"
                  >
                    Order
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No low stock items 🎉</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
