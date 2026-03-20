"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GalleryVerticalEnd, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EmailVerifiedPage() {
  const searchParams = useSearchParams();

  // Gunakan useMemo untuk menghindari setState dalam useEffect
  const alreadyVerified = useMemo(() => {
    return searchParams.get("already") === "true";
  }, [searchParams]);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          TK Harapan Bunda
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div
              className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-full ${
                alreadyVerified ? "bg-yellow-100" : "bg-green-100"
              }`}
            >
              {alreadyVerified ? (
                <AlertCircle className="size-8 text-yellow-600" />
              ) : (
                <CheckCircle className="size-8 text-green-600" />
              )}
            </div>
            <CardTitle className="text-xl">
              {alreadyVerified
                ? "Email Sudah Diverifikasi"
                : "Email Berhasil Diverifikasi!"}
            </CardTitle>
            <CardDescription className="text-balance">
              {alreadyVerified
                ? "Email Anda sudah diverifikasi sebelumnya. Silakan login untuk melanjutkan."
                : "Terima kasih! Email Anda telah berhasil diverifikasi. Sekarang Anda dapat mengakses semua fitur aplikasi."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!alreadyVerified && (
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                <p>
                  ✨ Akun Anda sudah aktif! Silakan login untuk mulai
                  menggunakan aplikasi.
                </p>
              </div>
            )}

            <Link href="/login" className="block">
              <Button className="w-full">Masuk ke Akun</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
