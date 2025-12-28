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
import { Plus, Search, Trash, Edit } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

// interface Supplier {
//   id: number;
//   name: string;
// }

interface Equipment {
  id: number;
  name: string;
  category?: string;
  serialNumber?: string;
  status: "ACTIVE" | "UNDER_MAINTENANCE" | "DAMAGED" | "RETIRED";
  purchaseDate?: string;
  quantity: number;
//   supplier?: Supplier;
}

const fetchEquipment = async (): Promise<Equipment[]> => {
  const res = await apiClient.get("/api/equipment");
  return res.data || [];
};

export default function EquipmentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: equipment = [],
    isLoading,
    error,
  } = useQuery<Equipment[]>({
    queryKey: ["equipment"],
    queryFn: fetchEquipment,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/equipment/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["equipment"] }),
  });

  if (isLoading) return <p>Loading equipment...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const filteredEquipment = equipment.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

 return (
  <div className="min-h-screen bg-slate-50 p-6 space-y-8">
    {/* Header */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Equipment Inventory
        </h1>
        <p className="text-slate-500 mt-1">
          Manage and track laboratory equipment status.
        </p>
      </div>

      <Button
        asChild
        className="bg-blue-600 hover:bg-blue-700 text-white shadow"
      >
        <Link href="/equipment/new">
          <Plus className="h-4 w-4 mr-2" /> Add Equipment
        </Link>
      </Button>
    </div>

    {/* Table Card */}
    <Card className="border-blue-100 shadow-sm">
      <CardHeader className="pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardTitle className="text-lg font-semibold text-blue-800">
          Equipment List
        </CardTitle>

        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search equipment..."
            className="pl-9 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                Category
              </TableHead>
              <TableHead className="font-semibold text-blue-700">
                Serial No.
              </TableHead>
              <TableHead className="font-semibold text-blue-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-blue-700">
                Quantity
              </TableHead>
              <TableHead className="text-right font-semibold text-blue-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredEquipment.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-blue-50 transition"
              >
                <TableCell className="font-medium text-slate-800">
                  {item.name}
                </TableCell>

                <TableCell className="text-slate-600">
                  {item.category || "-"}
                </TableCell>

                <TableCell className="text-slate-600">
                  {item.serialNumber || "-"}
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  <span
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        item.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : item.status === "UNDER_MAINTENANCE"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "DAMAGED"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-200 text-slate-700"
                      }
                    `}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                </TableCell>

                <TableCell className="font-semibold text-slate-800">
                  {item.quantity}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-blue-100"
                      onClick={() =>
                        router.push(
                          `/equipment/new?id=${item.id}&name=${encodeURIComponent(
                            item.name
                          )}&category=${encodeURIComponent(
                            item.category || ""
                          )}&serialNumber=${encodeURIComponent(
                            item.serialNumber || ""
                          )}&status=${item.status}&quantity=${item.quantity}`
                        )
                      }
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-100"
                      onClick={() => {
                        if (confirm(`Delete "${item.name}"?`)) {
                          deleteMutation.mutate(item.id);
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
  </div>
);
}