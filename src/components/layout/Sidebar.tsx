"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Importación de iconos Lucide (Asegúrate de haber corrido: npm install lucide-react)
import {
  ShieldCheck,
  History,
  Users,
  Key,
  UserCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Settings,
  UserCog,
  LayoutDashboard,
} from "lucide-react";

// Importación segura de la utilidad cn
import { cn } from "@/lib/utils/cn";

const menuItems = [
  {
    category: "Principal",
    items: [{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
  },
  {
    category: "Autenticación",
    items: [
      {
        name: "Logs de Auditoría",
        path: "/dashboard/auth/audit-logs",
        icon: History,
      },
      {
        name: "Configurar 2FA",
        path: "/dashboard/auth/2fa",
        icon: Fingerprint,
      },
    ],
  },
  {
    category: "Usuarios y Roles",
    items: [
      { name: "Usuarios", path: "/dashboard/users", icon: Users },
      { name: "Roles", path: "/dashboard/roles", icon: UserCog },
      { name: "Permisos", path: "/dashboard/permissions", icon: Key },
    ],
  },
  {
    category: "Seguridad",
    items: [
      {
        name: "IPs Bloqueadas",
        path: "/dashboard/security/blocked-ips",
        icon: ShieldCheck,
      },
      {
        name: "Desbloquear Cuenta",
        path: "/dashboard/security/unlock-account",
        icon: Lock,
      },
    ],
  },
  {
    category: "Configuración",
    items: [
      { name: "Mi Perfil", path: "/dashboard/profile", icon: UserCircle },
      {
        name: "Seguridad",
        path: "/dashboard/profile/change-password",
        icon: Settings,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-[#0f172a] text-slate-400 transition-all duration-300 border-r border-slate-800 flex flex-col z-50",
        collapsed ? "w-20" : "w-72",
      )}
    >
      {/* SECCIÓN DEL LOGO */}
      <div className="p-6 h-20 flex items-center justify-between border-b border-slate-800/50">
        {!collapsed && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
              <span className="text-white font-bold text-xl italic">U</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm tracking-tight">
                UCALDAS
              </span>
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest leading-none">
                Admin Panel
              </span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-white mx-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
        {menuItems.map((section) => (
          <div key={section.category} className="space-y-2">
            {!collapsed && (
              <h3 className="px-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-[2px]">
                {section.category}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "hover:bg-slate-800/50 hover:text-slate-200",
                    )}
                  >
                    <item.icon
                      size={20}
                      className={cn(
                        "shrink-0 transition-colors",
                        isActive
                          ? "text-white"
                          : "text-slate-500 group-hover:text-blue-400",
                      )}
                    />
                    {!collapsed && (
                      <span className="text-sm font-medium tracking-wide">
                        {item.name}
                      </span>
                    )}

                    {/* Tooltip para modo colapsado */}
                    {collapsed && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-slate-700 whitespace-nowrap z-[100]">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* FOOTER DEL SIDEBAR */}
      <div className="p-4 border-t border-slate-800/50">
        {!collapsed ? (
          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/50 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              V 1.0.4 - Stable
            </p>
          </div>
        ) : (
          <div className="flex justify-center text-slate-600 font-bold text-xs">
            V1
          </div>
        )}
      </div>
    </aside>
  );
}
