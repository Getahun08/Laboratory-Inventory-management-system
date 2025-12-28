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

interface Equipment {
  id: number;
  name: string;
  category?: string;
  serialNumber?: string;
  status: "ACTIVE" | "UNDER_MAINTENANCE" | "DAMAGED" | "RETIRED";
  purchaseDate?: string;
  quantity: number;
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipment</h1>
          <p className="text-muted-foreground">
            Manage laboratory equipment inventory.
          </p>
        </div>
        <Button asChild>
          <Link href="/equipment/new">
            <Plus className="h-4 w-4 mr-2" /> Add Equipment
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle className="text-lg font-medium">Equipment List</CardTitle>
          <div className="relative flex-1 max-w-sm mt-4 md:mt-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search equipment..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Serial No.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredEquipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category || "-"}</TableCell>
                  <TableCell>{item.serialNumber || "-"}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.quantity}</TableCell>

                  <TableCell className="text-right flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
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
                      onClick={() => {
                        if (confirm(`Delete "${item.name}"?`)) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
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
