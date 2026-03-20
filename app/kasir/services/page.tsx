"use client";

import { useServices } from "@/hooks/use-services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wrench } from "lucide-react";

export default function ServicesPage() {
  const { services, loading, error } = useServices();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Daftar Jasa</h1>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Total Jasa Aktif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{services.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : services.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Tidak ada jasa
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Jasa</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.nama_jasa}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(service.harga)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-500">Aktif</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
