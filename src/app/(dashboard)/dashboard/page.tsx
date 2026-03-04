"use client";
import { Users, ShieldCheck, Activity, Lock } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    label: "Usuarios Activos",
    value: "1,284",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Intentos Bloqueados",
    value: "43",
    icon: ShieldCheck,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    label: "Tiempo de Actividad",
    value: "99.9%",
    icon: Activity,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Roles Definidos",
    value: "12",
    icon: Lock,
    color: "text-[#b5a27c]",
    bg: "bg-[#efd9af]/20",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-2">
      {/* SECCIÓN DE BIENVENIDA */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-[#00284d] tracking-tight uppercase">
          Resumen del Sistema
        </h1>
        <p className="text-gray-500 text-sm">
          Bienvenido al panel administrativo de SAPFIAI. Aquí tienes el estado
          actual.
        </p>
      </div>

      {/* GRILLA DE TARJETAS (STATS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Estadística
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-[#00284d]">
                {stat.value}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {stat.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SECCIÓN INFERIOR: TABLA O GRÁFICO (REPLEGABLE) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-[#00284d] uppercase text-xs tracking-widest">
            Actividad Reciente del Servidor
          </h2>
          <button className="text-[10px] font-bold text-[#d5bb87] hover:underline uppercase">
            Ver logs completos
          </button>
        </div>
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#00284d]/5 rounded-full flex items-center justify-center mb-4">
            <Activity className="text-[#00284d]/20" size={32} />
          </div>
          <p className="text-gray-400 text-sm max-w-xs">
            No hay alertas críticas en las últimas 24 horas. El sistema opera
            con normalidad.
          </p>
        </div>
      </div>
    </div>
  );
}
