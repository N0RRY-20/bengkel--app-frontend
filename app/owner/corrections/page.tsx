"use client";

import { useEffect, useState } from "react";
import { useCorrections, createCorrection } from "@/hooks/use-reports";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, FileEdit, Eye } from "lucide-react";
import { Correction } from "@/types/report";

export default function CorrectionsPage() {
  const { corrections, loading, error, pagination, fetchCorrections } =
    useCorrections();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCorrection, setSelectedCorrection] =
    useState<Correction | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    source_type: "work_order" as "work_order" | "sale",
    source_id: "",
    alasan: "",
  });

  useEffect(() => {
    fetchCorrections(currentPage);
  }, [currentPage, fetchCorrections]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await createCorrection({
        source_type: formData.source_type,
        source_id: parseInt(formData.source_id),
        alasan: formData.alasan,
      });
      setCreateDialogOpen(false);
      setFormData({ source_type: "work_order", source_id: "", alasan: "" });
      fetchCorrections(1);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal membuat koreksi";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const viewCorrection = (correction: Correction) => {
    setSelectedCorrection(correction);
    setViewDialogOpen(true);
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <FileEdit className="h-8 w-8 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Koreksi & Audit</h1>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Buat Koreksi
        </Button>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <p className="text-sm text-yellow-800">
            <strong>Perhatian:</strong> Koreksi akan tercatat secara permanen
            dan tidak bisa dihapus. Pastikan alasan koreksi jelas dan lengkap.
          </p>
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
          ) : corrections.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Tidak ada koreksi
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Source ID</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {corrections.map((correction) => (
                  <TableRow key={correction.id}>
                    <TableCell className="font-mono">
                      #{correction.id}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(correction.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {correction.source_type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>#{correction.source_id}</TableCell>
                    <TableCell>{correction.owner?.name || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewCorrection(correction)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Koreksi Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Tipe Sumber *</Label>
              <Select
                value={formData.source_type}
                onValueChange={(v: "work_order" | "sale") =>
                  setFormData({ ...formData, source_type: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work_order">Work Order</SelectItem>
                  <SelectItem value="sale">Sale (Penjualan)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source_id">ID Sumber *</Label>
              <Input
                id="source_id"
                type="number"
                placeholder="Masukkan ID Work Order atau Sale"
                value={formData.source_id}
                onChange={(e) =>
                  setFormData({ ...formData, source_id: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alasan">Alasan Koreksi *</Label>
              <Textarea
                id="alasan"
                placeholder="Jelaskan alasan koreksi secara detail (min 10 karakter)"
                value={formData.alasan}
                onChange={(e) =>
                  setFormData({ ...formData, alasan: e.target.value })
                }
                required
                minLength={10}
                rows={4}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Simpan Koreksi
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Koreksi #{selectedCorrection?.id}</DialogTitle>
          </DialogHeader>
          {selectedCorrection && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipe</p>
                  <p className="font-medium capitalize">
                    {selectedCorrection.source_type.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Source ID</p>
                  <p className="font-medium">#{selectedCorrection.source_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p className="font-medium">
                    {selectedCorrection.owner?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Waktu</p>
                  <p className="font-medium">
                    {formatDate(selectedCorrection.created_at)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alasan</p>
                <p className="p-3 bg-muted rounded-lg mt-1">
                  {selectedCorrection.alasan}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Data Sebelum
                  </p>
                  <pre className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(selectedCorrection.sebelum, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Data Sesudah
                  </p>
                  <pre className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(selectedCorrection.sesudah, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
