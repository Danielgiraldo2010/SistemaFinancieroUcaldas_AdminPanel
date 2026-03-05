"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image"; // Importación necesaria para el logo
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
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
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ESTADOS PARA EL SCROLL
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const desktopNavRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  const checkScroll = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      const hasMore = scrollHeight - scrollTop > clientHeight + 15;
      setShowScrollArrow(hasMore);
    }
  };

  useEffect(() => {
    const currentRef = isMobileOpen ? mobileNavRef : desktopNavRef;
    const handleScroll = () => checkScroll(currentRef);

    setTimeout(() => checkScroll(currentRef), 100);

    const navElement = currentRef.current;
    navElement?.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      navElement?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isMobileOpen, collapsed, pathname]);

  const handleNavigation = (path: string) => {
    if (path === pathname) {
      setIsMobileOpen(false);
      return;
    }
    router.push(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .nav-mask {
          mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
          -webkit-mask-image: linear-gradient(
            to bottom,
            black 85%,
            transparent 100%
          );
        }
      `}</style>

      {/* --- MÓVIL --- */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-5 left-5 z-[60] p-3 bg-[#00284d]/90 text-[#d5bb87] rounded-full border border-[#d5bb87]/30 shadow-2xl"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col lg:hidden bg-[#00284d]"
          >
            <div className="flex justify-between items-center p-8 shrink-0">
              <div className="flex items-center gap-3">
                <div className="shrink-0 flex items-center justify-center rounded-xl border border-[#d5bb87]/30 w-[42px] h-[42px] bg-[#003e70] overflow-hidden shadow-inner">
                  <Image
                    src="/images/Logo_Amarillo.png"
                    alt="Logo U. de Caldas"
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-2xl font-serif">
                    SAPFIAI
                  </span>
                  <span className="text-[#d5bb87] text-[10px] tracking-[3px] uppercase">
                    U. de Caldas
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-[#d5bb87]"
              >
                <X size={32} />
              </button>
            </div>

            <nav
              ref={mobileNavRef}
              className="flex-1 overflow-y-auto no-scrollbar px-8 space-y-8 pb-20"
            >
              {menuItems.map((section) => (
                <div key={section.category}>
                  <h3 className="text-[10px] font-black text-[#d5bb87]/40 uppercase tracking-[4px] mb-4">
                    {section.category}
                  </h3>
                  <div className="grid gap-2">
                    {section.items.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className={cn(
                          "flex items-center gap-5 p-5 rounded-2xl border border-transparent",
                          pathname === item.path
                            ? "bg-[#d5bb87]/20 border-[#d5bb87]/30 text-[#d5bb87]"
                            : "text-[#efd9af]",
                        )}
                      >
                        <item.icon size={24} />
                        <span className="text-lg font-semibold">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ESCRITORIO --- */}
      <aside
        className={cn(
          "hidden lg:flex h-screen sticky top-0 transition-all duration-300 flex-col z-50 border-r border-[#003e70]",
          collapsed ? "w-20" : "w-72",
        )}
        style={{ background: "#00284d" }}
      >
        <div className="p-5 h-[72px] flex items-center justify-between border-b border-[#003e70]">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              {/* LOGO AMARILLO REAL */}
              <div className="shrink-0 flex items-center justify-center rounded-xl border border-[#d5bb87]/30 w-[42px] h-[42px] bg-[#003e70] overflow-hidden shadow-inner">
                <Image
                  src="/images/Logo_Amarillo.png"
                  alt="Logo U. de Caldas"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-bold text-sm font-serif">
                  SAPFIAI
                </span>
                <span className="text-[#d5bb87] text-[10px] uppercase font-black">
                  U. de Caldas
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto shrink-0 flex items-center justify-center rounded-lg border border-[#d5bb87]/20 w-[36px] h-[36px] bg-[#003e70] overflow-hidden">
              <Image
                src="/images/Logo_Amarillo.png"
                alt="Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-[#d5bb87] hover:bg-[#003e70]"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="relative flex-1 flex flex-col min-h-0">
          <nav
            ref={desktopNavRef}
            className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar nav-mask"
          >
            {menuItems.map((section) => (
              <div key={section.category} className="space-y-2">
                {!collapsed && (
                  <h3 className="px-4 text-[10px] font-extrabold text-[#d5bb87]/40 uppercase tracking-[2px]">
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
                            ? "bg-[#003e70] text-[#d5bb87] border border-[#d5bb87]/20 shadow-lg"
                            : "text-[#efd9af]/70 hover:bg-[#003e70]/50 hover:text-[#d5bb87]",
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#d5bb87]" />
                        )}
                        <item.icon
                          size={20}
                          className={cn(
                            "shrink-0",
                            isActive
                              ? "text-[#d5bb87]"
                              : "text-[#d5bb87]/50 group-hover:text-[#d5bb87]",
                          )}
                        />
                        {!collapsed && (
                          <span className="text-sm font-medium tracking-wide">
                            {item.name}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <AnimatePresence>
            {!collapsed && showScrollArrow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 left-0 right-0 flex flex-col items-center pointer-events-none z-10"
              >
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                  className="flex flex-col items-center bg-gradient-to-t from-[#00284d] via-[#00284d]/80 to-transparent w-full pt-8 pb-2"
                >
                  <span className="text-[#d5bb87] text-[8px] uppercase tracking-[4px] font-bold mb-1 opacity-60">
                    Deslizar
                  </span>
                  <ChevronDown
                    size={14}
                    className="text-[#d5bb87] opacity-40"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </>
  );
}
