"use client";

import { useAuthStore } from "@/store";
import { motion } from "framer-motion";
import Link from "next/link";
import { WalletCards, FileText, ShoppingCart, CalendarDays, Clock, AlertCircle } from "lucide-react";

const mockAgenda = [
  { hora: "08:00", evento: "Reunión Comité Financiero", lugar: "Sala A - Rectoría", tipo: "Reunión", estado: "Confirmado" },
  { hora: "09:30", evento: "Revisión ejecución presupuestal Q1", lugar: "Virtual - Teams", tipo: "Revisión", estado: "Confirmado" },
  { hora: "11:00", evento: "Entrega informe de ingresos propios", lugar: "Oficina Financiera", tipo: "Entrega", estado: "Pendiente" },
  { hora: "14:00", evento: "Capacitación sistema SAPFIAI", lugar: "Sala de Cómputo 3", tipo: "Capacitación", estado: "Confirmado" },
  { hora: "15:30", evento: "Firma resolución RES-005-2025", lugar: "Despacho Rector", tipo: "Firma", estado: "Pendiente" },
  { hora: "17:00", evento: "Cierre de caja diario", lugar: "Tesorería", tipo: "Operativo", estado: "Confirmado" },
];

const tipoColor: Record<string, string> = {
  Reunión: "bg-blue-50 text-blue-700 border-blue-100",
  Revisión: "bg-purple-50 text-purple-700 border-purple-100",
  Entrega: "bg-amber-50 text-amber-700 border-amber-100",
  Capacitación: "bg-teal-50 text-teal-700 border-teal-100",
  Firma: "bg-rose-50 text-rose-700 border-rose-100",
  Operativo: "bg-slate-100 text-slate-600 border-slate-200",
};

const accesoRapido = [
  {
    label: "Presupuesto Inicial",
    descripcion: "Apropiación vigente",
    path: "/dashboard/presupuesto/ejecucion",
    icon: WalletCards,
    color: "bg-[#00284d] text-white",
    iconColor: "text-[#d5bb87]",
  },
  {
    label: "CDP",
    descripcion: "Certificados de disponibilidad",
    path: "/dashboard/presupuesto/solicitudes",
    icon: FileText,
    color: "bg-[#003e70] text-white",
    iconColor: "text-[#d5bb87]",
  },
  {
    label: "Compras",
    descripcion: "Órdenes y adquisiciones",
    path: "/dashboard/presupuesto/gastos",
    icon: ShoppingCart,
    color: "bg-[#00284d]/80 text-white",
    iconColor: "text-[#d5bb87]",
  },
];

const mockPendientes = [
  { titulo: "Aprobar solicitud SOL-002", modulo: "Solicitudes", prioridad: "Alta", vence: "Hoy" },
  { titulo: "Revisar informe de gastos operativos", modulo: "Informes", prioridad: "Media", vence: "Mañana" },
  { titulo: "Firmar resolución RES-005-2025", modulo: "Resoluciones", prioridad: "Alta", vence: "Hoy" },
  { titulo: "Validar ejecución presupuestal Q1", modulo: "Presupuesto", prioridad: "Media", vence: "31 Mar" },
  { titulo: "Actualizar datos de suscripción SOL-006", modulo: "Solicitudes", prioridad: "Baja", vence: "2 Abr" },
];

const prioridadColor: Record<string, string> = {
  Alta: "bg-red-50 text-red-600 border-red-100",
  Media: "bg-amber-50 text-amber-700 border-amber-100",
  Baja: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const hoy = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const nombre = user?.email?.split("@")[0].replace(".", " ") ?? "usuario";

  return (
    <div className="space-y-6">
      {/* Saludo */}
      <div>
        <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">
          Bienvenido, {nombre}
        </h1>
        <p className="text-sm text-slate-500 capitalize">{hoy}</p>
      </div>

      {/* Fila superior: Agenda Hoy + Acceso Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Agenda Hoy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
            <CalendarDays size={18} className="text-[#00284d]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#00284d]">Agenda Hoy</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 max-h-72">
            {mockAgenda.map((item, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-3 hover:bg-slate-50/60 transition-colors">
                <span className="text-sm font-black text-[#00284d] font-mono w-12 shrink-0">{item.hora}</span>
                <div className="w-px self-stretch bg-[#d5bb87]/30 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.evento}</p>
                  <p className="text-xs text-slate-400">{item.lugar}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-black border ${item.estado === "Confirmado" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                  {item.estado}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Acceso Rápido */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
            <Clock size={18} className="text-[#00284d]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#00284d]">Acceso Rápido</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-4 p-6">
            {accesoRapido.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02] hover:shadow-md ${item.color}`}
              >
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <item.icon size={22} className={item.iconColor} />
                </div>
                <div>
                  <p className="text-sm font-black">{item.label}</p>
                  <p className="text-[11px] opacity-70">{item.descripcion}</p>
                </div>
                <span className="ml-auto text-lg opacity-40">→</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fila inferior: Pendientes */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm"
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <AlertCircle size={18} className="text-[#00284d]" />
          <span className="text-xs font-black uppercase tracking-widest text-[#00284d]">Pendientes</span>
          <span className="ml-auto px-2.5 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-black">
            {mockPendientes.length}
          </span>
        </div>
        <div className="divide-y divide-slate-50">
          {mockPendientes.map((p, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{p.titulo}</p>
                <p className="text-xs text-slate-400">{p.modulo}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${prioridadColor[p.prioridad]}`}>
                {p.prioridad}
              </span>
              <span className="text-xs font-bold text-slate-500 w-16 text-right shrink-0">{p.vence}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
