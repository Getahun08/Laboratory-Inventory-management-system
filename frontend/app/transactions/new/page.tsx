"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { useSearchParams, useRouter } from "next/navigation";

type TransactionType = "IN" | "OUT" | "ADJUSTMENT";

export default function NewTransactionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id"); // edit mode if exists

  const [equipmentId, setEquipmentId] = useState<number | "">("");
  const [chemicalId, setChemicalId] = useState<number | "">("");
  const [supplierId, setSupplierId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [transactionType, setTransactionType] = useState<TransactionType>("IN");
  const [transactionDate, setTransactionDate] = useState("");
  const [notes, setNotes] = useState("");

  // 🔹 Fetch transaction when editing
  useEffect(() => {
    if (!id) return;

    const fetchTransaction = async () => {
      try {
        const res = await apiClient.get(`/api/transactions/${id}`);
        const tx = res.data;

        setEquipmentId(tx.equipment?.id || "");
        setChemicalId(tx.chemical?.id || "");
        setSupplierId(tx.supplier?.id || "");
        setQuantity(tx.quantity || "");
        setTransactionType(tx.transactionType);
        setTransactionDate(tx.transactionDate?.slice(0, 10) || "");
        setNotes(tx.notes || "");
      } catch (err) {
        console.error("Failed to fetch transaction", err);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!equipmentId) return alert("Equipment is required");
    if (!chemicalId) return alert("Chemical is required");
    if (!quantity) return alert("Quantity is required");
    if (!transactionDate) return alert("Date is required");

    const payload = {
      equipmentId: Number(equipmentId),
      chemicalId: Number(chemicalId),
      supplierId: supplierId ? Number(supplierId) : null,
      quantity: Number(quantity),
      transactionType,
      transactionDate,
      notes,
    };

    try {
      if (id) {
        await apiClient.put(`/api/transactions/${id}`, payload);
        alert("Transaction updated successfully");
      } else {
        await apiClient.post("/api/transactions", payload);
        alert("Transaction created successfully");
      }
      router.push("/transactions");
    } catch (err) {
      console.error(err);
      alert("Failed to save transaction");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/transactions">
              <ArrowLeft className="h-4 w-4 text-blue-600" />
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl font-bold">
              {id ? "Edit Transaction" : "Add Transaction"}
            </h1>
            <p className="text-slate-500">
              {id
                ? "Update transaction details"
                : "Record a new inventory transaction"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>
                Fill in the transaction information.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Equipment ID */}
              <div className="space-y-2">
                <Label>Equipment ID</Label>
                <Input
                  type="number"
                  value={equipmentId}
                  onChange={(e) =>
                    setEquipmentId(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>

              {/* Chemical ID */}
              <div className="space-y-2">
                <Label>Chemical ID</Label>
                <Input
                  type="number"
                  value={chemicalId}
                  onChange={(e) =>
                    setChemicalId(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>

              {/* Supplier ID */}
              <div className="space-y-2">
                <Label>Supplier ID (optional)</Label>
                <Input
                  type="number"
                  value={supplierId}
                  onChange={(e) =>
                    setSupplierId(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>

              {/* Transaction Type */}
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={transactionType}
                  onChange={(e) =>
                    setTransactionType(e.target.value as TransactionType)
                  }
                >
                  <option value="IN">IN</option>
                  <option value="OUT">OUT</option>
                  <option value="ADJUSTMENT">ADJUSTMENT</option>
                </select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2 md:col-span-2">
                <Label>Notes</Label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline" asChild>
                <Link href="/transactions">Cancel</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow" type="submit">
                {id ? "Update Transaction" : "Save Transaction"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
