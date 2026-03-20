"use client";

import { KasirGuard } from "@/components/guards";
import { MainLayout } from "@/components/layout/main-layout";

export default function KasirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KasirGuard>
      <MainLayout>{children}</MainLayout>
    </KasirGuard>
  );
}
