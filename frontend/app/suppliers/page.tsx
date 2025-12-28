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
import { Plus, Search, Mail, Phone, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
}

const fetchSuppliers = async (): Promise<Supplier[]> => {
  try {
    const res = await apiClient.get("/api/suppliers");
    return res.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default function SuppliersPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: suppliers = [],
    isLoading,
    error,
  } = useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/suppliers/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suppliers"] }),
  });

  if (isLoading) return <p>Loading suppliers...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const filteredSuppliers = suppliers.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your vendors and contact information.
          </p>
        </div>
        <Button asChild>
          <Link href="/suppliers/new">
            <Plus className="h-4 w-4 mr-2" /> Add Supplier
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Suppliers List</CardTitle>
          <div className="flex items-center gap-2 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search suppliers..."
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
                <TableHead>Company Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredSuppliers.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.contactPerson}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {item.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {item.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(
                          `/suppliers/new?id=${item.id}&name=${encodeURIComponent(
                            item.name
                          )}&contactPerson=${encodeURIComponent(
                            item.contactPerson
                          )}&email=${encodeURIComponent(
                            item.email
                          )}&phoneNumber=${encodeURIComponent(
                            item.phoneNumber
                          )}`
                        )
                      }
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                      <span className="sr-only">Edit</span>
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
                      <span className="sr-only">Delete</span>
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
