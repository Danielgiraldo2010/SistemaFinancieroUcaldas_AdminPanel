import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Clock3,
  Download,
  FileSpreadsheet,
  FileText,
  Globe,
  History,
  Home,
  KeyRound,
  Landmark,
  Lock,
  Receipt,
  Settings,
  Shield,
  TrendingUp,
  UserCircle,
  UserCog,
  Users,
  WalletCards,
} from "lucide-react";

export type DashboardMenuLeaf = {
  name: string;
  path: string;
  icon: LucideIcon;
};

export type DashboardMenuSection = {
  name: string;
  icon: LucideIcon;
  path?: string;
  items?: DashboardMenuLeaf[];
};

export type DashboardRouteMeta = {
  title: string;
  subtitle: string;
  breadcrumbs: string[];
};

export const dashboardMenu: DashboardMenuSection[] = [
  {
    name: "Inicio",
    icon: Home,
    items: [
      { name: "Reportes",      path: "/dashboard/inicio/reportes",    icon: FileText },
      { name: "Resoluciones",  path: "/dashboard/inicio/resoluciones", icon: ClipboardList },
      { name: "Agenda Hoy",    path: "/dashboard/inicio/agenda-hoy",   icon: CalendarDays },
    ],
  },
  {
    name: "Normatividad",
    icon: BookOpen,
    items: [
      { name: "Acuerdos",              path: "/dashboard/normatividad/acuerdos",              icon: FileText },
      { name: "Catálogo Presupuestal", path: "/dashboard/normatividad/catalogo-presupuestal", icon: ClipboardList },
      { name: "Manual de Presupuesto", path: "/dashboard/normatividad/manual-presupuesto",    icon: BookOpen },
    ],
  },
  {
    name: "Presupuesto Inicial",
    icon: WalletCards,
    path: "/dashboard/presupuesto",
    items: [
      { name: "Ingresos",   path: "/dashboard/presupuesto/ingresos",  icon: Landmark },
      { name: "Gastos",     path: "/dashboard/presupuesto/gastos",    icon: Receipt },
      { name: "Ejecución",  path: "/dashboard/presupuesto/ejecucion", icon: TrendingUp },
    ],
  },
  {
    name: "Estadísticas",
    icon: BarChart3,
    path: "/dashboard/estadisticas",
  },
  {
    name: "Reportes",
    icon: FileSpreadsheet,
    items: [
      { name: "Exportar XLS", path: "/dashboard/reportes/exportar-xls", icon: Download },
      { name: "Exportar PDF", path: "/dashboard/reportes/exportar-pdf", icon: FileText },
    ],
  },
  {
    name: "Administración",
    icon: Settings,
    items: [
      { name: "Usuarios",  path: "/dashboard/administracion/usuarios",  icon: Users },
      { name: "Roles",     path: "/dashboard/administracion/roles",     icon: UserCog },
      { name: "Permisos",  path: "/dashboard/administracion/permisos",  icon: KeyRound },
    ],
  },
  {
    name: "Auditoría",
    icon: Shield,
    items: [
      { name: "Logs de acceso",          path: "/dashboard/auth/audit-logs",                icon: History },
      { name: "IP de usuario",           path: "/dashboard/auditoria/ip-usuario",           icon: Globe },
      { name: "Hora de inicio de sesión",path: "/dashboard/auditoria/hora-inicio-sesion",   icon: Clock3 },
      { name: "Historial de actividad",  path: "/dashboard/auditoria/historial-actividad",  icon: ClipboardList },
    ],
  },
];

const dashboardRouteMeta: Record<string, DashboardRouteMeta> = {
  "/dashboard": { title: "Panel de Control", subtitle: "INICIO", breadcrumbs: ["Inicio"] },

  "/dashboard/inicio/reportes":    { title: "Reportes",     subtitle: "INICIO", breadcrumbs: ["Inicio", "Reportes"] },
  "/dashboard/inicio/resoluciones":{ title: "Resoluciones", subtitle: "INICIO", breadcrumbs: ["Inicio", "Resoluciones"] },
  "/dashboard/inicio/agenda-hoy":  { title: "Agenda Hoy",   subtitle: "INICIO", breadcrumbs: ["Inicio", "Agenda Hoy"] },

  "/dashboard/normatividad/acuerdos":              { title: "Acuerdos",              subtitle: "NORMATIVIDAD", breadcrumbs: ["Inicio", "Normatividad", "Acuerdos"] },
  "/dashboard/normatividad/catalogo-presupuestal": { title: "Catálogo Presupuestal", subtitle: "NORMATIVIDAD", breadcrumbs: ["Inicio", "Normatividad", "Catálogo Presupuestal"] },
  "/dashboard/normatividad/manual-presupuesto":    { title: "Manual de Presupuesto", subtitle: "NORMATIVIDAD", breadcrumbs: ["Inicio", "Normatividad", "Manual de Presupuesto"] },

  "/dashboard/presupuesto":          { title: "Presupuesto Inicial", subtitle: "PRESUPUESTO INICIAL", breadcrumbs: ["Inicio", "Presupuesto Inicial"] },
  "/dashboard/presupuesto/ingresos":        { title: "Ingresos",      subtitle: "PRESUPUESTO INICIAL", breadcrumbs: ["Inicio", "Presupuesto Inicial", "Ingresos"] },
  "/dashboard/presupuesto/ingresos/nuevo":   { title: "Nuevo Ingreso",  subtitle: "PRESUPUESTO INICIAL", breadcrumbs: ["Inicio", "Presupuesto Inicial", "Ingresos", "Nuevo"] },
  "/dashboard/presupuesto/gastos":           { title: "Gastos",        subtitle: "PRESUPUESTO INICIAL", breadcrumbs: ["Inicio", "Presupuesto Inicial", "Gastos"] },
  "/dashboard/presupuesto/gastos/nuevo":     { title: "Nuevo Gasto",   subtitle: "PRESUPUESTO INICIAL", breadcrumbs: ["Inicio", "Presupuesto Inicial", "Gastos", "Nuevo"] },
  "/dashboard/presupuesto/ejecucion":        { title: "Ejecución",     subtitle: "PRESUPUESTO INICIAL", breadcrumbs: ["Inicio", "Presupuesto Inicial", "Ejecución"] },

  "/dashboard/estadisticas": { title: "Estadísticas", subtitle: "ESTADÍSTICAS", breadcrumbs: ["Inicio", "Estadísticas"] },

  "/dashboard/reportes/exportar-xls": { title: "Exportar XLS", subtitle: "REPORTES", breadcrumbs: ["Inicio", "Reportes", "Exportar XLS"] },
  "/dashboard/reportes/exportar-pdf": { title: "Exportar PDF", subtitle: "REPORTES", breadcrumbs: ["Inicio", "Reportes", "Exportar PDF"] },

  "/dashboard/administracion":           { title: "Administración",  subtitle: "ADMINISTRACIÓN", breadcrumbs: ["Inicio", "Administración"] },
  "/dashboard/administracion/usuarios":   { title: "Usuarios",        subtitle: "ADMINISTRACIÓN", breadcrumbs: ["Inicio", "Administración", "Usuarios"] },
  "/dashboard/administracion/roles":      { title: "Roles",           subtitle: "ADMINISTRACIÓN", breadcrumbs: ["Inicio", "Administración", "Roles"] },
  "/dashboard/administracion/permisos":   { title: "Permisos",        subtitle: "ADMINISTRACIÓN", breadcrumbs: ["Inicio", "Administración", "Permisos"] },

  "/dashboard/auth/audit-logs":                { title: "Logs de acceso",           subtitle: "AUDITORÍA", breadcrumbs: ["Inicio", "Auditoría", "Logs de acceso"] },
  "/dashboard/auditoria/ip-usuario":           { title: "IP de usuario",            subtitle: "AUDITORÍA", breadcrumbs: ["Inicio", "Auditoría", "IP de usuario"] },
  "/dashboard/auditoria/hora-inicio-sesion":   { title: "Hora de inicio de sesión", subtitle: "AUDITORÍA", breadcrumbs: ["Inicio", "Auditoría", "Hora de inicio de sesión"] },
  "/dashboard/auditoria/historial-actividad":  { title: "Historial de actividad",   subtitle: "AUDITORÍA", breadcrumbs: ["Inicio", "Auditoría", "Historial de actividad"] },

  "/dashboard/users":       { title: "Gestión de Usuarios",    subtitle: "USUARIOS Y ROLES", breadcrumbs: ["Inicio", "Usuarios y Roles", "Gestión de Usuarios"] },
  "/dashboard/roles":       { title: "Configuración de Roles", subtitle: "USUARIOS Y ROLES", breadcrumbs: ["Inicio", "Usuarios y Roles", "Configuración de Roles"] },
  "/dashboard/permissions": { title: "Gestión de Permisos",    subtitle: "USUARIOS Y ROLES", breadcrumbs: ["Inicio", "Usuarios y Roles", "Gestión de Permisos"] },
  "/dashboard/auth/2fa":    { title: "Autenticación de Doble Factor", subtitle: "AUTENTICACIÓN", breadcrumbs: ["Inicio", "Autenticación", "Doble Factor"] },

  "/dashboard/profile":                  { title: "Mi Perfil",           subtitle: "CONFIGURACIÓN", breadcrumbs: ["Inicio", "Configuración", "Mi Perfil"] },
  "/dashboard/profile/change-password":  { title: "Cambio de Contraseña",subtitle: "CONFIGURACIÓN", breadcrumbs: ["Inicio", "Configuración", "Cambio de Contraseña"] },
  "/dashboard/security/blocked-ips":     { title: "IPs Bloqueadas",      subtitle: "SEGURIDAD",     breadcrumbs: ["Inicio", "Seguridad", "IPs Bloqueadas"] },
  "/dashboard/security/unlock-account":  { title: "Desbloquear Cuenta",  subtitle: "SEGURIDAD",     breadcrumbs: ["Inicio", "Seguridad", "Desbloquear Cuenta"] },
};

export function getDashboardRouteMeta(pathname: string): DashboardRouteMeta {
  const exactMeta = dashboardRouteMeta[pathname];
  if (exactMeta) return exactMeta;

  const matchedPath = Object.keys(dashboardRouteMeta)
    .sort((a, b) => b.length - a.length)
    .find((routePath) => pathname.startsWith(`${routePath}/`));

  if (matchedPath) return dashboardRouteMeta[matchedPath];

  const segments = pathname
    .replace(/^\/dashboard\/?/, "")
    .split("/")
    .filter(Boolean)
    .map((s) => decodeURIComponent(s).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));

  return {
    title: segments[segments.length - 1] || "Panel de Control",
    subtitle: (segments[0] || "Sistema").toUpperCase(),
    breadcrumbs: ["Inicio", ...segments],
  };
}

export const dashboardLegacyQuickLinks: DashboardMenuLeaf[] = [
  { name: "Usuarios",          path: "/dashboard/users",                  icon: Users },
  { name: "Roles",             path: "/dashboard/roles",                  icon: UserCog },
  { name: "Permisos",          path: "/dashboard/permissions",            icon: KeyRound },
  { name: "Configurar 2FA",    path: "/dashboard/auth/2fa",               icon: Shield },
  { name: "Mi Perfil",         path: "/dashboard/profile",                icon: UserCircle },
  { name: "Cambiar Contraseña",path: "/dashboard/profile/change-password",icon: Lock },
];
