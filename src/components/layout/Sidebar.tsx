"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { canViewDashboardSection } from "@/lib";
import { dashboardMenu } from "@/config/dashboard-navigation";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store";

const isPathActive = (pathname: string, path: string) =>
  pathname === path || pathname.startsWith(`${path}/`);

const isSectionActive = (pathname: string, section: (typeof dashboardMenu)[number]) => {
  if (section.path) {
    return isPathActive(pathname, section.path);
  }
  return (
    section.items?.some((item) => isPathActive(pathname, item.path)) ?? false
  );
};

const getInitialExpandedSections = (pathname: string) =>
  dashboardMenu.reduce<Record<string, boolean>>((acc, section) => {
    if (section.items?.length) {
      acc[section.name] = isSectionActive(pathname, section);
    }
    return acc;
  }, {});

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () => getInitialExpandedSections(pathname),
  );

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

  const filteredMenu = dashboardMenu.filter((section) =>
    canViewDashboardSection(section.name, user?.roleName),
  );

  const visibleExpandedSections = filteredMenu.reduce<Record<string, boolean>>(
    (acc, section) => {
      if (section.items?.length) {
        acc[section.name] = !!expandedSections[section.name];
      }
      return acc;
    },
    {},
  );

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
  }, [isMobileOpen, collapsed, pathname, visibleExpandedSections]);

  const handleNavigation = (path: string) => {
    if (path === pathname) {
      setIsMobileOpen(false);
      return;
    }
    router.push(path);
    setIsMobileOpen(false);
  };

  const toggleSection = (sectionName: string) => {
    if (collapsed) setCollapsed(false);

    setExpandedSections((current) => ({
      ...current,
      [sectionName]: !current[sectionName],
    }));
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
              className="flex-1 overflow-y-auto no-scrollbar px-8 space-y-5 pb-20"
            >
              {filteredMenu.map((section) => {
                const hasChildren = Boolean(section.items?.length);
                const sectionActive = isSectionActive(pathname, section);
                const sectionExpanded = visibleExpandedSections[section.name];

                return (
                  <div key={section.name} className="space-y-2">
                    {hasChildren ? (
                      <>
                        <button
                          onClick={() => toggleSection(section.name)}
                          className={cn(
                            "w-full flex items-center justify-between gap-4 p-5 rounded-2xl border transition-colors",
                            sectionActive
                              ? "bg-[#d5bb87]/20 border-[#d5bb87]/30 text-[#d5bb87]"
                              : "border-[#d5bb87]/10 text-[#efd9af]",
                          )}
                        >
                          <span className="flex items-center gap-4">
                            <section.icon size={24} />
                            <span className="text-lg font-semibold">
                              {section.name}
                            </span>
                          </span>
                          <ChevronDown
                            size={20}
                            className={cn(
                              "transition-transform",
                              sectionExpanded && "rotate-180",
                            )}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {sectionExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="grid gap-2 pl-4 border-l border-[#d5bb87]/15 ml-5">
                                {section.items?.map((item) => {
                                  const isActive = isPathActive(pathname, item.path);
                                  return (
                                    <button
                                      key={item.path}
                                      onClick={() => handleNavigation(item.path)}
                                      className={cn(
                                        "flex items-center gap-4 p-4 rounded-2xl border border-transparent text-left transition-colors",
                                        isActive
                                          ? "bg-[#d5bb87]/20 border-[#d5bb87]/30 text-[#d5bb87]"
                                          : "text-[#efd9af]",
                                      )}
                                    >
                                      <item.icon size={20} />
                                      <span className="text-base font-medium">
                                        {item.name}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <button
                        onClick={() => handleNavigation(section.path!)}
                        className={cn(
                          "w-full flex items-center gap-4 p-5 rounded-2xl border transition-colors",
                          sectionActive
                            ? "bg-[#d5bb87]/20 border-[#d5bb87]/30 text-[#d5bb87]"
                            : "border-transparent text-[#efd9af]",
                        )}
                      >
                        <section.icon size={24} />
                        <span className="text-lg font-semibold">
                          {section.name}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

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
            className="flex-1 overflow-y-auto py-6 px-4 space-y-3 no-scrollbar nav-mask"
          >
            {filteredMenu.map((section) => {
              const hasChildren = Boolean(section.items?.length);
              const sectionActive = isSectionActive(pathname, section);
              const sectionExpanded = visibleExpandedSections[section.name];

              return (
                <div key={section.name} className="space-y-1">
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleSection(section.name)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                          sectionActive
                            ? "bg-[#003e70] text-[#d5bb87] border border-[#d5bb87]/20 shadow-lg"
                            : "text-[#efd9af]/70 hover:bg-[#003e70]/50 hover:text-[#d5bb87]",
                          collapsed && "justify-center px-3",
                        )}
                      >
                        {sectionActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#d5bb87]" />
                        )}
                        <section.icon
                          size={20}
                          className={cn(
                            "shrink-0",
                            sectionActive
                              ? "text-[#d5bb87]"
                              : "text-[#d5bb87]/50 group-hover:text-[#d5bb87]",
                          )}
                        />
                        {!collapsed && (
                          <>
                            <span className="text-sm font-medium tracking-wide flex-1 text-left">
                              {section.name}
                            </span>
                            <ChevronDown
                              size={16}
                              className={cn(
                                "transition-transform",
                                sectionExpanded && "rotate-180",
                              )}
                            />
                          </>
                        )}
                      </button>

                      {!collapsed && (
                        <AnimatePresence initial={false}>
                          {sectionExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 pl-3 border-l border-[#d5bb87]/10 space-y-1">
                                {section.items?.map((item) => {
                                  const isActive = isPathActive(pathname, item.path);
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
                                        size={18}
                                        className={cn(
                                          isActive
                                            ? "text-[#d5bb87]"
                                            : "text-[#d5bb87]/50 group-hover:text-[#d5bb87]",
                                        )}
                                      />
                                      <span className="text-sm font-medium tracking-wide">
                                        {item.name}
                                      </span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </>
                  ) : (
                    <Link
                      href={section.path!}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                        sectionActive
                          ? "bg-[#003e70] text-[#d5bb87] border border-[#d5bb87]/20 shadow-lg"
                          : "text-[#efd9af]/70 hover:bg-[#003e70]/50 hover:text-[#d5bb87]",
                        collapsed && "justify-center px-3",
                      )}
                    >
                      {sectionActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#d5bb87]" />
                      )}
                      <section.icon
                        size={20}
                        className={cn(
                          "shrink-0",
                          sectionActive
                            ? "text-[#d5bb87]"
                            : "text-[#d5bb87]/50 group-hover:text-[#d5bb87]",
                        )}
                      />
                      {!collapsed && (
                        <span className="text-sm font-medium tracking-wide">
                          {section.name}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
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
