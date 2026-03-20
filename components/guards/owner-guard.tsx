"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface OwnerGuardProps {
  children: React.ReactNode;
}

export function OwnerGuard({ children }: OwnerGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!user.email_verified_at) {
        router.push("/verify-email");
      } else if (user.role !== "owner") {
        router.push("/unauthorized");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.email_verified_at || user.role !== "owner") {
    return null;
  }

  return <>{children}</>;
}
