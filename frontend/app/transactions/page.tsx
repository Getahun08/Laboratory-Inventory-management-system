"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/apiClient";

interface Transaction {
  id: number;
  equipment: { id: number; name: string };
  chemical: { id: number; name: string };
  supplier: { id: number; name: string };
  quantity: number;
  transactionType: "IN" | "OUT" | "ADJUSTMENT";
  transactionDate: string;
  notes?: string;
}


const fetchTransactions = async (): Promise<Transaction[]> => {
  const res = await apiClient.get("/api/transactions"); 
  return res.data || [];
};

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  if (isLoading) return <p>Loading transactions...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.chemical?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.equipment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View history of inventory movements.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">
            Transaction History
          </CardTitle>
          <div className="flex items-center gap-2 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Chemical</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.chemical?.name}</TableCell>
                  <TableCell>{tx.equipment?.name}</TableCell>
                  <TableCell>{tx.supplier?.name}</TableCell>

                  <TableCell>{tx.quantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.transactionType === "IN" ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-orange-600" />
                      )}
                      {tx.transactionType}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {tx.transactionDate}
                  </TableCell>
                  <TableCell>{tx.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
