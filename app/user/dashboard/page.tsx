"use client";

import { useAuth } from "@/lib/auth-context";
import { UserGuard } from "@/components/guards";

export default function UserDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <UserGuard>
      <div className="min-h-screen bg-yellow-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-green-700">
                Dashboard User
              </h1>
              <p className="text-gray-600">Selamat datang, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Keluar
            </button>
          </div>

          {/* Konten User */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Dashboard User</h2>
            <p className="text-gray-600">
              Belum ada data terbaru untuk saat ini.
            </p>
          </div>
        </div>
      </div>
    </UserGuard>
  );
}
