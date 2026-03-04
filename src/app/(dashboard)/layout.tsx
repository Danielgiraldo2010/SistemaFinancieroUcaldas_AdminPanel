"use client";
import { useState } from "react";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/lib/auth/store";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, ChevronDown, UserCircle, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

// Mapeo de rutas para títulos dinámicos según tu Sidebar
const routeConfig: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Resumen Global", subtitle: "DASHBOARD" },
  "/dashboard/users": {
    title: "Gestión de Usuarios",
    subtitle: "USUARIOS Y ROLES",
  },
  "/dashboard/roles": {
    title: "Configuración de Roles",
    subtitle: "USUARIOS Y ROLES",
  },
  "/dashboard/permissions": {
    title: "Gestión de Permisos",
    subtitle: "USUARIOS Y ROLES",
  },
  "/dashboard/auth/audit-logs": {
    title: "Logs de Auditoría",
    subtitle: "AUTENTICACIÓN",
  },
  "/dashboard/profile": { title: "Mi Perfil", subtitle: "CONFIGURACIÓN" },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const currentRoute = routeConfig[pathname] || {
    title: "Panel de Control",
    subtitle: "SISTEMA",
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#f8fafc]">
        <Sidebar />

        <div className="flex flex-col flex-1 w-full min-w-0">
          {/* HEADER DINÁMICO */}
          <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between bg-white px-8 border-b border-gray-100 shadow-sm">
            {/* Títulos dinámicos y Breadcrumbs */}
            <div className="flex items-center gap-4 pl-12 lg:pl-0">
              <LayoutDashboard
                size={18}
                className="text-[#00284d] opacity-40 hidden md:block"
              />
              <div className="h-5 w-[1px] bg-gray-200 mx-2 hidden md:block" />
              <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">
                  {currentRoute.subtitle}
                </span>
                <span className="hidden lg:block text-gray-300 text-xs">/</span>
                <h1 className="text-sm font-black text-[#00284d] uppercase tracking-wider">
                  {currentRoute.title}
                </h1>
              </div>
            </div>

            {/* Acciones de Perfil */}
            <div className="flex items-center gap-6">
              {/* Badge de Rol Institucional */}
              <div className="hidden sm:block px-4 py-1 bg-[#efd9af]/30 border border-[#d5bb87]/20 rounded-full">
                <span className="text-[9px] font-black text-[#b5a27c] uppercase tracking-widest">
                  Rol: SuperAdmin
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 group transition-all"
                >
                  <div className="flex flex-col items-end leading-none hidden md:flex">
                    <span className="text-[12px] font-bold text-[#00284d] group-hover:text-[#003e70] transition-colors">
                      {user?.email || "usuario@ucaldas.edu.co"}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      Administrador
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-[#00284d] flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-sm ring-1 ring-gray-100 group-hover:scale-105 transition-transform">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "text-gray-400 transition-transform duration-300",
                      isProfileOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* MENÚ DROPDOWN */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden"
                      >
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <UserCircle size={18} className="text-[#003e70]" />
                          <span className="text-sm font-medium">Mi Perfil</span>
                        </Link>

                        <div className="h-[1px] bg-gray-100 my-1 mx-4" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors group"
                        >
                          <LogOut
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                          <span className="text-sm font-bold uppercase tracking-tight text-left">
                            Cerrar Sesión
                          </span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
