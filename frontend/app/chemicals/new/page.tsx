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

export default function NewChemicalPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id"); // If editing

  const [name, setName] = useState("");
  const [chemicalFormula, setChemicalFormula] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unit, setUnit] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [storageLocation, setStorageLocation] = useState("");

  // Populate form if editing
  useEffect(() => {
    if (id) {
      const fetchChemical = async () => {
        try {
          const res = await apiClient.get(`/api/chemicals/${id}`);
          const chem = res.data;
          setName(chem.name || "");
          setChemicalFormula(chem.chemicalFormula || "");
          setQuantity(chem.quantity || "");
          setUnit(chem.unit || "");
          setExpiryDate(chem.expiryDate || "");
          setStorageLocation(chem.storageLocation || "");
        } catch (err) {
          console.error("Failed to fetch chemical:", err);
        }
      };
      fetchChemical();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) return alert("Chemical name is required");
    if (!chemicalFormula.trim()) return alert("Chemical formula is required");
    if (!quantity) return alert("Quantity is required");
    if (!unit.trim()) return alert("Unit is required");
    if (!expiryDate.trim()) return alert("Expiry date is required");
    if (!storageLocation.trim()) return alert("Storage location is required");

    const chemicalData = {
      name,
      chemicalFormula,
      quantity: Number(quantity),
      unit,
      expiryDate,
      storageLocation,
    };

    try {
      if (id) {
        // Update chemical
        await apiClient.put(`/api/chemicals/${id}`, chemicalData);
        alert("Chemical updated successfully!");
      } else {
        // Add new chemical
        await apiClient.post("/api/chemicals", chemicalData);
        alert("Chemical added successfully!");
      }
      router.push("/chemicals");
    } catch (err) {
      console.error(err);
      alert("Failed to save chemical");
    }
  };

  return (
  <div className="min-h-screen bg-slate-50 py-8 px-4">
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="hover:bg-blue-50"
        >
          <Link href="/chemicals">
            <ArrowLeft className="h-4 w-4 text-blue-600" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {id ? "Edit Chemical" : "Add Chemical"}
          </h1>
          <p className="text-slate-500">
            {id
              ? "Update chemical information"
              : "Register a new chemical in the inventory"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-800">
              Chemical Details
            </CardTitle>
            <CardDescription>
              Enter the specifications of the chemical.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Chemical Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sulfuric Acid"
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Formula */}
            <div className="space-y-2">
              <Label htmlFor="chemicalFormula" className="text-slate-700">
                Chemical Formula
              </Label>
              <Input
                id="chemicalFormula"
                value={chemicalFormula}
                onChange={(e) => setChemicalFormula(e.target.value)}
                placeholder="e.g. H₂SO₄"
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-slate-700">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="e.g. 25"
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-slate-700">
                Unit
              </Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. L, mL"
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Expiry */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-slate-700">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <Label
                htmlFor="storageLocation"
                className="text-slate-700"
              >
                Storage Location
              </Label>
              <Input
                id="storageLocation"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                placeholder="e.g. Storage Room A"
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t border-blue-100">
            <Button
              variant="outline"
              asChild
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Link href="/chemicals">Cancel</Link>
            </Button>

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow"
            >
              {id ? "Update Chemical" : "Save Chemical"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  </div>
);
}
