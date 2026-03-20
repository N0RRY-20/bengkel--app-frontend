"use client";

import { AdminGuard } from "@/components/guards";
import { MainLayout } from "@/components/layout/main-layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <MainLayout>{children}</MainLayout>
    </AdminGuard>
  );
}
