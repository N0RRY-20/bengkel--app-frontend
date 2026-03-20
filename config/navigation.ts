import { NavSection, UserRole } from "@/types/navigation";

export const navigationConfig: Record<UserRole, NavSection[]> = {
  owner: [
    {
      title: "Dashboard",
      items: [
        { title: "Overview", href: "/owner/dashboard", icon: "LayoutDashboard" },
      ],
    },
    {
      title: "Operasional",
      items: [
        { title: "Work Orders", href: "/owner/work-orders", icon: "ClipboardList" },
        { title: "Penjualan", href: "/owner/sales", icon: "ShoppingCart" },
        { title: "Pembayaran", href: "/owner/payments", icon: "CreditCard" },
      ],
    },
    {
      title: "Master Data",
      items: [
        { title: "Produk", href: "/owner/products", icon: "Package" },
        { title: "Jasa", href: "/owner/services", icon: "Wrench" },
        { title: "Mekanik", href: "/owner/mechanics", icon: "Users" },
      ],
    },
    {
      title: "Manajemen",
      items: [
        { title: "Users", href: "/owner/users", icon: "UserCog" },
        { title: "Koreksi", href: "/owner/corrections", icon: "FileEdit" },
      ],
    },
    {
      title: "Laporan",
      items: [
        { title: "Laporan Harian", href: "/owner/reports/daily", icon: "FileText" },
        { title: "Laporan Bulanan", href: "/owner/reports/monthly", icon: "Calendar" },
        { title: "Activity Log", href: "/owner/reports/activity", icon: "History" },
      ],
    },
  ],

  admin: [
    {
      title: "Dashboard",
      items: [
        { title: "Overview", href: "/admin/dashboard", icon: "LayoutDashboard" },
      ],
    },
    {
      title: "Operasional",
      items: [
        { title: "Work Orders", href: "/admin/work-orders", icon: "ClipboardList" },
        { title: "Penjualan", href: "/admin/sales", icon: "ShoppingCart" },
      ],
    },
    {
      title: "Master Data",
      items: [
        { title: "Produk", href: "/admin/products", icon: "Package" },
        { title: "Jasa", href: "/admin/services", icon: "Wrench" },
        { title: "Mekanik", href: "/admin/mechanics", icon: "Users" },
      ],
    },
    {
      title: "Manajemen",
      items: [
        { title: "Users", href: "/admin/users", icon: "UserCog" },
      ],
    },
  ],

  kasir: [
    {
      title: "Dashboard",
      items: [
        { title: "Overview", href: "/kasir/dashboard", icon: "LayoutDashboard" },
      ],
    },
    {
      title: "Transaksi",
      items: [
        { title: "Buat Work Order", href: "/kasir/work-orders/create", icon: "FilePlus" },
        { title: "Daftar Work Order", href: "/kasir/work-orders", icon: "ClipboardList" },
        { title: "POS Sparepart", href: "/kasir/pos", icon: "ShoppingCart" },
        { title: "Daftar Bon", href: "/kasir/pending-sales", icon: "Receipt" },
      ],
    },
    {
      title: "Referensi",
      items: [
        { title: "Produk", href: "/kasir/products", icon: "Package" },
        { title: "Jasa", href: "/kasir/services", icon: "Wrench" },
      ],
    },
  ],

  mekanik: [
    {
      title: "Dashboard",
      items: [
        { title: "Overview", href: "/mekanik/dashboard", icon: "LayoutDashboard" },
      ],
    },
    {
      title: "Pekerjaan",
      items: [
        { title: "Pekerjaan Saya", href: "/mekanik/my-work-orders", icon: "ClipboardList" },
        { title: "Pendapatan", href: "/mekanik/earnings", icon: "Wallet" },
      ],
    },
  ],
};
