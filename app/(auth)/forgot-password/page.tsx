"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GalleryVerticalEnd, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  email: z.string().email({
    message: "Email tidak valid.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    try {
      const { ok, data } = await apiPost<{
        success?: boolean;
        message?: string;
      }>("/api/forgot-password", values);

      if (ok && data.success) {
        setSubmittedEmail(values.email);
        setIsSubmitted(true);
      } else {
        form.setError("root", {
          message: data.message || "Gagal mengirim email reset password.",
        });
      }
    } catch {
      form.setError("root", {
        message: "Gagal menghubungi server.",
      });
    }
  };

  if (isSubmitted) {
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
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Email Terkirim!</CardTitle>
              <CardDescription className="text-balance">
                Kami telah mengirimkan link reset password ke
                <span className="block mt-1 font-medium text-foreground">
                  {submittedEmail}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                <p>
                  Silakan cek inbox email Anda dan klik link untuk mengatur
                  password baru. Jika tidak menemukan email, cek juga folder
                  spam.
                </p>
              </div>

              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 size-4" />
                  Kembali ke Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
              <Mail className="size-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Lupa Password?</CardTitle>
            <CardDescription className="text-balance">
              Masukkan email Anda dan kami akan mengirimkan link untuk mengatur
              password baru.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {form.formState.errors.root && (
                  <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                    {form.formState.errors.root.message}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Link Reset Password"
                  )}
                </Button>

                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full" type="button">
                    <ArrowLeft className="mr-2 size-4" />
                    Kembali ke Login
                  </Button>
                </Link>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
