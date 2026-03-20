import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
        <p className="text-xl mb-6">
          Anda tidak memiliki akses ke halaman ini.
        </p>
        <Link href="/" className="text-primary underline">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
