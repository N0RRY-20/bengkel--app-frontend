"use client";

import { useState } from "react";
import { useWorkOrders } from "@/hooks/use-work-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Eye } from "lucide-react";
import Link from "next/link";

export default function WorkOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { workOrders, loading, error, refetch } = useWorkOrders(
    statusFilter || undefined
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "dikerjakan":
        return <Badge variant="secondary">Dikerjakan</Badge>;
      case "selesai":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-600"
          >
            Selesai
          </Badge>
        );
      case "dibayar":
        return <Badge className="bg-green-500">Dibayar</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Daftar Work Order</h1>
        <Link href="/kasir/work-orders/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Buat Work Order
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="dikerjakan">Dikerjakan</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="dibayar">Dibayar</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
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
          ) : workOrders.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Tidak ada Work Order
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Plat Nomor</TableHead>
                  <TableHead>Pemilik</TableHead>
                  <TableHead>Mekanik</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((wo) => (
                  <TableRow key={wo.id}>
                    <TableCell className="font-mono">#{wo.id}</TableCell>
                    <TableCell className="font-semibold">
                      {wo.plat_nomor}
                    </TableCell>
                    <TableCell>{wo.nama_pemilik}</TableCell>
                    <TableCell>{wo.mechanic?.user?.name || "-"}</TableCell>
                    <TableCell>{getStatusBadge(wo.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(wo.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/kasir/work-orders/${wo.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                      </Link>
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
