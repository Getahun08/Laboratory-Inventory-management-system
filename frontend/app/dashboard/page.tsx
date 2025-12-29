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

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Admin. Here is your inventory overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/chemicals/new">
              <Plus className="h-4 w-4 mr-2" /> Add Chemical
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/transactions">View Reports</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon
                className={`h-4 w-4 text-muted-foreground ${stat.color || ""}`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest inventory movements.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length ? (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <FlaskConical className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.chemicalName}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.type} • {tx.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-right">
                      <p className="font-medium">{tx.quantity}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No transactions found.
                </p>
              )}
            </div>
            <div className="mt-4">
              <Button asChild variant="ghost" className="w-full text-sm">
                <Link href="/transactions">
                  View All Transactions <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Items below reorder level.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStock.length ? (
                lowStock.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} (Min: {item.minQuantity})
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Order
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No low stock items.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
