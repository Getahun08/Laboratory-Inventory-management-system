"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/apiClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Trash, Edit, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Chemical {
  id: number;
  name: string;
  chemicalFormula: string;
  unit?: "ML" | "L";
  quantity: number;
  storageLocation?: string;
  expiryDate?: string;
}

// used to Fetch chemicals
const fetchChemicals = async (): Promise<Chemical[]> => {
  try {
    const res = await apiClient.get("/api/chemicals");
    return res.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default function ChemicalsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: chemicals = [],
    isLoading,
    error,
  } = useQuery<Chemical[]>({
    queryKey: ["chemicals"],
    queryFn: fetchChemicals,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/chemicals/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["chemicals"] }),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
  }, [router]);

  if (isLoading) return <p>Loading chemicals...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const filteredChemicals = chemicals.filter((chem) =>
    chem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Chemicals Inventory
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and monitor laboratory chemicals safely.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <FileText className="h-4 w-4 mr-2" /> Export
          </Button>

          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white shadow"
          >
            <Link href="/chemicals/new">
              <Plus className="h-4 w-4 mr-2" /> Add Chemical
            </Link>
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-blue-50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-blue-800">
                Inventory List
              </CardTitle>
              <p className="text-sm text-slate-500">
                Total chemicals:{" "}
                <span className="font-semibold">{chemicals.length}</span>
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search chemicals..."
                className="pl-9 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="font-semibold text-blue-700">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-blue-700">
                  Formula
                </TableHead>
                <TableHead className="hidden md:table-cell font-semibold text-blue-700">
                  Unit
                </TableHead>
                <TableHead className="font-semibold text-blue-700">
                  Quantity
                </TableHead>
                <TableHead className="hidden md:table-cell font-semibold text-blue-700">
                  Location
                </TableHead>
                <TableHead className="font-semibold text-blue-700">
                  Expiry
                </TableHead>
                <TableHead className="text-right font-semibold text-blue-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Empty State */}
              {filteredChemicals.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-slate-400 py-6"
                  >
                    No chemicals found.
                  </TableCell>
                </TableRow>
              )}

              {filteredChemicals.map((chem) => (
                <TableRow
                  key={chem.id}
                  className="hover:bg-blue-50 transition"
                >
                  <TableCell className="font-medium text-slate-800">
                    {chem.name}
                  </TableCell>

                  <TableCell className="text-slate-600">
                    {chem.chemicalFormula}
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-slate-600">
                    {chem.unit || "-"}
                  </TableCell>

                  <TableCell className="font-semibold text-slate-800">
                    {chem.quantity}
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-slate-600">
                    {chem.storageLocation || "-"}
                  </TableCell>

                  <TableCell
                    className={
                      chem.expiryDate ? "text-slate-700" : "text-slate-400"
                    }
                  >
                    {chem.expiryDate || "-"}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-100"
                        onClick={() =>
                          router.push(
                            `/chemicals/new?id=${chem.id}&name=${encodeURIComponent(
                              chem.name
                            )}&formula=${encodeURIComponent(
                              chem.chemicalFormula
                            )}&quantity=${chem.quantity}&unit=${chem.unit}&location=${encodeURIComponent(
                              chem.storageLocation || ""
                            )}&expiry=${chem.expiryDate}`
                          )
                        }
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-100"
                        onClick={() => {
                          if (confirm(`Delete "${chem.name}"?`)) {
                            deleteMutation.mutate(chem.id);
                          }
                        }}
                      >
                        <Trash className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <p className="text-center text-sm text-slate-400">
        Inventory updates automatically • Powered by React Query
      </p>
    </div>
  );
}
