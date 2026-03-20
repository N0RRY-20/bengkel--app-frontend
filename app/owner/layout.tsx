"use client";

import { OwnerGuard } from "@/components/guards";
import { MainLayout } from "@/components/layout/main-layout";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OwnerGuard>
      <MainLayout>{children}</MainLayout>
    </OwnerGuard>
  );
}
