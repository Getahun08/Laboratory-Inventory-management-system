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
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
}

// Fetch suppliers
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

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }})

  if (isLoading) return <p>Loading suppliers...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const filteredSuppliers = suppliers.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Suppliers
            </h1>
            <p className="text-slate-500">
              Manage vendors and supplier contact information.
            </p>
          </div>

          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white shadow"
          >
            <Link href="/suppliers/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Link>
          </Button>
        </div>

        {/* Supplier List */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="pb-4 space-y-3">
            <CardTitle className="text-blue-800 text-lg">
              Supplier List
            </CardTitle>

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search suppliers..."
                className="pl-9 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50 text-blue-700 font-bold">
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredSuppliers.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-blue-50 transition"
                  >
                    <TableCell className="font-medium text-slate-900">
                      {item.name}
                    </TableCell>

                    <TableCell className="text-slate-700">
                      {item.contactPerson}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail className="h-4 w-4 text-blue-500" />
                        {item.email}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="h-4 w-4 text-blue-500" />
                        {item.phoneNumber}
                      </div>
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
                              `/suppliers/new?id=${
                                item.id
                              }&name=${encodeURIComponent(
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
                        </Button>

                        {/* Delete */}
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
    </div>
  );
}
