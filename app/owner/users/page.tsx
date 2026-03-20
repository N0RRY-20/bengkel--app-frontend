"use client";

import { useState } from "react";
import {
  useUsers,
  useRolesSummary,
  createUser,
  updateUser,
  toggleUserActive,
  deleteUser,
} from "@/hooks/use-users";
import { User } from "@/types/user";
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
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  UserCog,
  Users,
  Shield,
  Wrench,
  CreditCard,
} from "lucide-react";

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<string>("");
  const { users, loading, error, refetch } = useUsers(
    roleFilter ? { role: roleFilter } : undefined
  );
  const { summary } = useRolesSummary();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "kasir",
    persentase_jasa: "0.3",
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Shield className="h-4 w-4" />;
      case "admin":
        return <UserCog className="h-4 w-4" />;
      case "kasir":
        return <CreditCard className="h-4 w-4" />;
      case "mekanik":
        return <Wrench className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "kasir":
        return "bg-green-100 text-green-800 border-green-300";
      case "mekanik":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "";
    }
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "kasir",
      persentase_jasa: "0.3",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      persentase_jasa: user.mechanic?.persentase_jasa.toString() || "0.3",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) {
        data.password = formData.password;
      }

      if (formData.role === "mekanik") {
        data.persentase_jasa = parseFloat(formData.persentase_jasa);
      }

      if (editingUser) {
        await updateUser(editingUser.id, data as Partial<User>);
      } else {
        data.password = formData.password;
        await createUser(data as { name: string; email: string; password: string; role: string });
      }

      setDialogOpen(false);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan user";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    const action = user.is_active ? "nonaktifkan" : "aktifkan";
    if (
      !confirm(
        `${action.charAt(0).toUpperCase() + action.slice(1)} user "${
          user.name
        }"?`
      )
    ) {
      return;
    }

    try {
      await toggleUserActive(user.id);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : `Gagal ${action} user`;
      alert(message);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Hapus user "${user.name}"? Ini tidak bisa dibatalkan.`)) {
      return;
    }

    try {
      await deleteUser(user.id);
      refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus user";
      alert(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen User</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah User
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["owner", "admin", "kasir", "mekanik"] as const).map((role) => (
          <Card
            key={role}
            className={`cursor-pointer transition-colors ${
              roleFilter === role ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setRoleFilter(roleFilter === role ? "" : role)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2 capitalize">
                {getRoleIcon(role)}
                {role}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {summary[role]?.active || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                dari {summary[role]?.total || 0} total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {roleFilter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter aktif:</span>
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setRoleFilter("")}
          >
            {roleFilter} ×
          </Badge>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Tidak ada user
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className={!user.is_active ? "opacity-50" : ""}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${getRoleBadgeColor(user.role)}`}
                      >
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{user.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {user.role !== "owner" ? (
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={() => handleToggleActive(user)}
                        />
                      ) : (
                        <Badge variant="default">Aktif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role !== "owner" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
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
              {editingUser ? "Edit User" : "Tambah User Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {editingUser ? "(kosongkan jika tidak diubah)" : "*"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!editingUser}
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
                disabled={editingUser?.role === "owner"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="kasir">Kasir</SelectItem>
                  <SelectItem value="mekanik">Mekanik</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.role === "mekanik" && (
              <div className="space-y-2">
                <Label htmlFor="persentase_jasa">Persentase Jasa</Label>
                <Input
                  id="persentase_jasa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.persentase_jasa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      persentase_jasa: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Contoh: 0.3 = 30%
                </p>
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingUser ? "Simpan Perubahan" : "Tambah User"}
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
