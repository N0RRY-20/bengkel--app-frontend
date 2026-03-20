"use client";

import { useState } from "react";
import {
  useProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
} from "@/hooks/use-products";
import { Product } from "@/types/master-data";
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
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
} from "lucide-react";

export default function ProductsPage() {
  const { products, loading, error, refetch } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    harga_jual: "",
    stok: "",
    tipe_pembeli: "umum" as "umum" | "bengkel",
  });

  const [stockAdjustment, setStockAdjustment] = useState({
    adjustment: "",
    reason: "",
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData({ nama: "", harga_jual: "", stok: "", tipe_pembeli: "umum" });
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nama: product.nama,
      harga_jual: product.harga_jual.toString(),
      stok: product.stok.toString(),
      tipe_pembeli: product.tipe_pembeli,
    });
    setDialogOpen(true);
  };

  const openStockDialog = (product: Product) => {
    setSelectedProduct(product);
    setStockAdjustment({ adjustment: "", reason: "" });
    setStockDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        nama: formData.nama,
        harga_jual: parseInt(formData.harga_jual),
        stok: parseInt(formData.stok),
        tipe_pembeli: formData.tipe_pembeli,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }

      setDialogOpen(false);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan produk";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setSaving(true);
    try {
      await updateProductStock(
        selectedProduct.id,
        parseInt(stockAdjustment.adjustment),
        stockAdjustment.reason
      );
      setStockDialogOpen(false);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal update stok";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Hapus produk "${product.nama}"?`)) return;

    try {
      await deleteProduct(product.id);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus produk";
      alert(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daftar Produk</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Produk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Stok Rendah (≤5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {products.filter((p) => p.stok <= 5 && p.stok > 0).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Stok Habis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {products.filter((p) => p.stok === 0).length}
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
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Tidak ada produk
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Produk</TableHead>
                  <TableHead className="text-right">Harga Jual</TableHead>
                  <TableHead className="text-center">Stok</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.nama}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.harga_jual)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          product.stok === 0
                            ? "destructive"
                            : product.stok <= 5
                            ? "secondary"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => openStockDialog(product)}
                      >
                        {product.stok}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {product.tipe_pembeli}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(product)}
                        >
                          <Trash2 className="h-4 w-4" />
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
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Produk *</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="harga_jual">Harga Jual (Rp) *</Label>
              <Input
                id="harga_jual"
                type="number"
                value={formData.harga_jual}
                onChange={(e) =>
                  setFormData({ ...formData, harga_jual: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stok">Stok *</Label>
              <Input
                id="stok"
                type="number"
                value={formData.stok}
                onChange={(e) =>
                  setFormData({ ...formData, stok: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipe_pembeli">Tipe Pembeli *</Label>
              <Select
                value={formData.tipe_pembeli}
                onValueChange={(value: "umum" | "bengkel") =>
                  setFormData({ ...formData, tipe_pembeli: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="umum">Umum</SelectItem>
                  <SelectItem value="bengkel">Bengkel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
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

      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stok: {selectedProduct?.nama}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStockAdjustment} className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Stok Saat Ini</p>
              <p className="text-3xl font-bold">{selectedProduct?.stok}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adjustment">
                Penyesuaian (+ untuk tambah, - untuk kurang)
              </Label>
              <Input
                id="adjustment"
                type="number"
                placeholder="Contoh: 10 atau -5"
                value={stockAdjustment.adjustment}
                onChange={(e) =>
                  setStockAdjustment({
                    ...stockAdjustment,
                    adjustment: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Alasan *</Label>
              <Input
                id="reason"
                placeholder="Contoh: Restok dari supplier"
                value={stockAdjustment.reason}
                onChange={(e) =>
                  setStockAdjustment({
                    ...stockAdjustment,
                    reason: e.target.value,
                  })
                }
                required
              />
            </div>
            {stockAdjustment.adjustment && (
              <div className="p-4 bg-primary/5 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Stok Baru</p>
                <p className="text-3xl font-bold text-primary">
                  {(selectedProduct?.stok || 0) +
                    parseInt(stockAdjustment.adjustment || "0")}
                </p>
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Stok
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStockDialogOpen(false)}
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
