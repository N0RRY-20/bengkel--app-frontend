"use client";

import { useState } from "react";
import {
  useServices,
  createService,
  updateService,
  deleteService,
} from "@/hooks/use-services";
import { ServiceMaster } from "@/types/master-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
import { Loader2, Plus, Pencil, Wrench } from "lucide-react";

export default function ServicesPage() {
  const [showAll, setShowAll] = useState(false);
  const { services, loading, error, refetch } = useServices(showAll);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceMaster | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nama_jasa: "",
    harga: "",
    is_active: true,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const openCreateDialog = () => {
    setEditingService(null);
    setFormData({ nama_jasa: "", harga: "", is_active: true });
    setDialogOpen(true);
  };

  const openEditDialog = (service: ServiceMaster) => {
    setEditingService(service);
    setFormData({
      nama_jasa: service.nama_jasa,
      harga: service.harga.toString(),
      is_active: service.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        nama_jasa: formData.nama_jasa,
        harga: parseInt(formData.harga),
        is_active: formData.is_active,
      };

      if (editingService) {
        await updateService(editingService.id, data);
      } else {
        await createService(data);
      }

      setDialogOpen(false);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan jasa";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service: ServiceMaster) => {
    if (!confirm(`Nonaktifkan jasa "${service.nama_jasa}"?`)) return;

    try {
      await deleteService(service.id);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menonaktifkan jasa";
      alert(message);
    }
  };

  const toggleActive = async (service: ServiceMaster) => {
    try {
      await updateService(service.id, { is_active: !service.is_active });
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal mengubah status";
      alert(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daftar Jasa</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Jasa
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Switch
              id="show-all"
              checked={showAll}
              onCheckedChange={setShowAll}
            />
            <Label htmlFor="show-all">Tampilkan jasa tidak aktif</Label>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Total Jasa Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {services.filter((s) => s.is_active).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Jasa Tidak Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-muted-foreground">
              {services.filter((s) => !s.is_active).length}
            </p>
          </CardContent>
        </Card>
      </div>

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
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow
                    key={service.id}
                    className={!service.is_active ? "opacity-50" : ""}
                  >
                    <TableCell className="font-medium">
                      {service.nama_jasa}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(service.harga)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={service.is_active}
                        onCheckedChange={() => toggleActive(service)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(service)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Jasa" : "Tambah Jasa Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama_jasa">Nama Jasa *</Label>
              <Input
                id="nama_jasa"
                placeholder="Contoh: Ganti Oli"
                value={formData.nama_jasa}
                onChange={(e) =>
                  setFormData({ ...formData, nama_jasa: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="harga">Harga (Rp) *</Label>
              <Input
                id="harga"
                type="number"
                placeholder="Contoh: 50000"
                value={formData.harga}
                onChange={(e) =>
                  setFormData({ ...formData, harga: e.target.value })
                }
                required
              />
            </div>
            {editingService && (
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Aktif</Label>
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingService ? "Simpan Perubahan" : "Tambah Jasa"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
