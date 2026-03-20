"use client";

import { useEffect, useState } from "react";
import { useActivityLogs } from "@/hooks/use-reports";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, History, ChevronLeft, ChevronRight } from "lucide-react";

export default function ActivityLogPage() {
  const { logs, loading, error, pagination, fetchLogs } = useActivityLogs(30);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage, fetchLogs]);

  const getActionBadge = (action: string) => {
    if (action.includes("create")) {
      return <Badge className="bg-green-500">Create</Badge>;
    }
    if (action.includes("update") || action.includes("finish")) {
      return <Badge className="bg-blue-500">Update</Badge>;
    }
    if (action.includes("delete")) {
      return <Badge variant="destructive">Delete</Badge>;
    }
    if (action.includes("payment")) {
      return <Badge className="bg-purple-500">Payment</Badge>;
    }
    if (action.includes("correction")) {
      return <Badge className="bg-orange-500">Correction</Badge>;
    }
    return <Badge variant="outline">{action}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <History className="h-8 w-8 text-muted-foreground" />
        <h1 className="text-3xl font-bold">Activity Log</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : logs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Tidak ada activity log
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-36">Waktu</TableHead>
                  <TableHead className="w-32">User</TableHead>
                  <TableHead className="w-28">Action</TableHead>
                  <TableHead>Deskripsi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(log.created_at)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.user?.name || "-"}
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell className="text-sm">{log.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {pagination.current_page} dari {pagination.last_page} (
            {pagination.total} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === pagination.last_page}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
