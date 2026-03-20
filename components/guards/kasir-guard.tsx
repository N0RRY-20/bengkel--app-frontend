"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface KasirGuardProps {
  children: React.ReactNode;
}

export function KasirGuard({ children }: KasirGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!user.email_verified_at) {
        router.push("/verify-email");
      } else if (user.role !== "kasir") {
        router.push("/unauthorized");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.email_verified_at || user.role !== "kasir") {
    return null;
  }

  return <>{children}</>;
}
