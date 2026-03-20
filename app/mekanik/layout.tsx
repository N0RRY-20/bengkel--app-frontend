"use client";

import { MekanikGuard } from "@/components/guards";
import { MainLayout } from "@/components/layout/main-layout";

export default function MekanikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MekanikGuard>
      <MainLayout>{children}</MainLayout>
    </MekanikGuard>
  );
}
