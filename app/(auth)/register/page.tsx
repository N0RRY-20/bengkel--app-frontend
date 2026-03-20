"use client";

import Image from "next/image";
import { GalleryVerticalEnd } from "lucide-react";
import { SignupForm } from "@/components/signup-form";
import { GuestGuard } from "@/components/guards";

export default function RegisterPage() {
  return (
    <GuestGuard>
      <div className="grid min-h-svh lg:grid-cols-[2.5fr_2fr]">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              TK Harapan Bunda
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <SignupForm />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <Image
            src="/image/register-bg.jpg"
            alt="TK Harapan Bunda"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </GuestGuard>
  );
}
