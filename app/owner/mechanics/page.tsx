"use client";

import { useState } from "react";
import {
  useMechanics,
  createMechanic,
  updateMechanic,
  getMechanicEarnings,
  MechanicEarnings,
} from "@/hooks/use-mechanics";
import { apiGet } from "@/lib/api";
import { Mechanic } from "@/types/master-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader2, Plus, Pencil, Users, Wallet } from "lucide-react";

interface MekanikUser {
  id: number;
  name: string;
  email: string;
}

export default function MechanicsPage() {
  const { mechanics, loading, error, refetch } = useMechanics();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [earningsDialogOpen, setEarningsDialogOpen] = useState(false);
  const [editingMechanic, setEditingMechanic] = useState<Mechanic | null>(null);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(
    null
  );
  const [earnings, setEarnings] = useState<MechanicEarnings | null>(null);
  const [saving, setSaving] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<MekanikUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingEarnings, setLoadingEarnings] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",
    persentase_jasa: "0.3",
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const fetchAvailableUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await apiGet<{ data: MekanikUser[] }>(
        "/api/users?role=mekanik"
      );
      if (response.ok) {
        const existingUserIds = mechanics.map((m) => m.user_id);
        const available = (response.data?.data || []).filter(
          (u: MekanikUser) => !existingUserIds.includes(u.id)
        );
        setAvailableUsers(available);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const openCreateDialog = () => {
    setEditingMechanic(null);
    setFormData({ user_id: "", persentase_jasa: "0.3" });
    setDialogOpen(true);
    fetchAvailableUsers();
  };

  const openEditDialog = (mechanic: Mechanic) => {
    setEditingMechanic(mechanic);
    setFormData({
      user_id: mechanic.user_id.toString(),
      persentase_jasa: mechanic.persentase_jasa.toString(),
    });
    setDialogOpen(true);
  };

  const openEarningsDialog = async (mechanic: Mechanic) => {
    setSelectedMechanic(mechanic);
    setEarnings(null);
    setEarningsDialogOpen(true);
    setLoadingEarnings(true);
    try {
      const response = await getMechanicEarnings(mechanic.id);
      if (response.ok && response.data) {
        setEarnings(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch earnings:", err);
    } finally {
      setLoadingEarnings(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        user_id: parseInt(formData.user_id),
        persentase_jasa: parseFloat(formData.persentase_jasa),
      };

      if (editingMechanic) {
        await updateMechanic(editingMechanic.id, {
          persentase_jasa: data.persentase_jasa,
        });
      } else {
        await createMechanic(data);
      }

      setDialogOpen(false);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan mekanik";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daftar Mekanik</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Mekanik
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total Mekanik
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{mechanics.length}</p>
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
          ) : mechanics.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Tidak ada mekanik
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Persentase Jasa</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mechanics.map((mechanic) => (
                  <TableRow key={mechanic.id}>
                    <TableCell className="font-medium">
                      {mechanic.nama || mechanic.user?.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {mechanic.email || mechanic.user?.email}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {(mechanic.persentase_jasa * 100).toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEarningsDialog(mechanic)}
                        >
                          <Wallet className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(mechanic)}
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
              {editingMechanic ? "Edit Mekanik" : "Tambah Mekanik Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingMechanic && (
              <div className="space-y-2">
                <Label htmlFor="user_id">Pilih User *</Label>
                {loadingUsers ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memuat user...
                  </div>
                ) : availableUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Tidak ada user dengan role mekanik yang tersedia. Buat user
                    baru dengan role mekanik terlebih dahulu.
                  </p>
                ) : (
                  <Select
                    value={formData.user_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, user_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih user" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {editingMechanic && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold">
                  {editingMechanic.nama || editingMechanic.user?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {editingMechanic.email || editingMechanic.user?.email}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="persentase_jasa">Persentase Jasa (0-1) *</Label>
              <Input
                id="persentase_jasa"
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="Contoh: 0.3 untuk 30%"
                value={formData.persentase_jasa}
                onChange={(e) =>
                  setFormData({ ...formData, persentase_jasa: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Contoh: 0.3 = 30%, 0.25 = 25%
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={saving || (!editingMechanic && !formData.user_id)}
                className="flex-1"
              >
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingMechanic ? "Simpan Perubahan" : "Tambah Mekanik"}
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

      <Dialog open={earningsDialogOpen} onOpenChange={setEarningsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Pendapatan:{" "}
              {selectedMechanic?.nama || selectedMechanic?.user?.name}
            </DialogTitle>
          </DialogHeader>
          {loadingEarnings ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : earnings ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Periode</p>
                <p className="font-semibold">{earnings.period}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Total WO</p>
                  <p className="text-2xl font-bold">
                    {earnings.total_work_orders}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Persentase</p>
                  <p className="text-2xl font-bold">
                    {(earnings.persentase * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Total Jasa</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(earnings.total_jasa)}
                </p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Pendapatan Mekanik
                </p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(earnings.pendapatan)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Tidak ada data pendapatan
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
