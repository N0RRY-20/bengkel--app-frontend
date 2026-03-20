"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UserGuardProps {
  children: React.ReactNode;
}

export function UserGuard({ children }: UserGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!user.email_verified_at) {
        // Redirect to verify-email if not verified
        router.push("/verify-email");
      }
    }
  }, [user, loading, router]);

  // Return null saat loading atau tidak authorized
  if (loading || !user || !user.email_verified_at) {
    return null;
  }

  return <>{children}</>;
}
