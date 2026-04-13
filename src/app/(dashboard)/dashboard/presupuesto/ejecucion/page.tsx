"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { presupuestoService } from "@/services";
import type { EjecucionPresupuestalDto } from "@/core";
import { Landmark, Receipt, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";

const fmt  = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
const fmtB = (n: number) => `$${(n / 1_000_000_000).toFixed(1)}B`;

const mockVigencias = [
  { vigencia: "2022", apropiado: 18.2, ejecutado: 17.1 },
  { vigencia: "2023", apropiado: 19.5, ejecutado: 18.8 },
  { vigencia: "2024", apropiado: 20.1, ejecutado: 19.4 },
  { vigencia: "2025", apropiado: 21.1, ejecutado: 12.4 },
];

export default function PresupuestoEjecucionPage() {
  const [data, setData] = useState<EjecucionPresupuestalDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    presupuestoService.getEjecucion().then((res) => {
      setData(res as EjecucionPresupuestalDto[]);
      setLoading(false);
    });
  }, []);

  const totalVigente = data.reduce((s, r) => s + r.presupuesto_vigente, 0);
  const totalPagado  = data.reduce((s, r) => s + r.pagado, 0);
  const pctGlobal    = totalVigente > 0 ? Math.round((totalPagado / totalVigente) * 100) : 0;

  const barData = data.map((r) => ({
    name: r.rubro_nombre.length > 14 ? r.rubro_nombre.slice(0, 14) + "…" : r.rubro_nombre,
    Vigente:      r.presupuesto_vigente,
    Comprometido: r.comprometido,
    Pagado:       r.pagado,
  }));

  return (
    <div className="space-y-6">
      {/* Botones navegación */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/presupuesto/ingresos"
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-sm transition-all">
          <Landmark size={15} /> Ingresos
        </Link>
        <Link href="/dashboard/presupuesto/gastos"
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-sm transition-all">
          <Receipt size={15} /> Gastos
        </Link>
        <Link href="/dashboard/presupuesto/ejecucion"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-2xl text-xs font-black uppercase tracking-widest shadow-md">
          <TrendingUp size={15} /> Ejecución
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Presupuesto vigente", value: fmt(totalVigente), color: "text-[#00284d]",  border: "border-l-4 border-[#00284d]" },
          { label: "Total pagado",        value: fmt(totalPagado),  color: "text-emerald-600", border: "border-l-4 border-emerald-400" },
          { label: "% Ejecución global",  value: `${pctGlobal}%`,   color: pctGlobal >= 80 ? "text-emerald-600" : "text-amber-600", border: "border-l-4 border-amber-400" },
        ].map((m) => (
          <div key={m.label} className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 ${m.border}`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{m.label}</p>
            <p className={`text-2xl font-black mt-1 ${m.color}`}>{loading ? "—" : m.value}</p>
          </div>
        ))}
      </div>

      {/* Barras de progreso por rubro */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
        <span className="text-xs font-black uppercase tracking-widest text-[#00284d]">
          Flujo: Apropiación → CDP → RP → Obligación → Pago
        </span>
        {loading
          ? [1,2,3].map((i) => <div key={i} className="animate-pulse space-y-2"><div className="h-4 bg-slate-100 rounded w-1/3" /><div className="h-3 bg-slate-100 rounded" /></div>)
          : data.map((r) => {
              const pct     = r.presupuesto_vigente > 0 ? Math.round((r.pagado / r.presupuesto_vigente) * 100) : 0;
              const pctComp = r.presupuesto_vigente > 0 ? Math.round((r.comprometido / r.presupuesto_vigente) * 100) : 0;
              return (
                <div key={r.id_presupuesto} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-bold text-slate-700">{r.rubro_nombre}</span>
                      <span className="ml-2 text-[10px] text-slate-400">{r.fuente_nombre}</span>
                    </div>
                    <span className={`text-xs font-black ${pct >= 80 ? "text-emerald-600" : "text-amber-600"}`}>{pct}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                    <div className="h-full bg-amber-300 transition-all" style={{ width: `${Math.max(0, pctComp - pct)}%` }} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-mono">
                    <span>Vigente: {fmt(r.presupuesto_vigente)}</span>
                    <span className="text-emerald-600">Pagado: {fmt(r.pagado)}</span>
                    <span className="text-amber-600">CDP: {fmt(r.comprometido)}</span>
                    <span>Disponible: {fmt(r.disponible)}</span>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Panel analítico */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Análisis de ejecución presupuestal</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-black uppercase tracking-widest text-[#00284d] mb-4">Ejecución por rubro — Vigencia 2025</p>
            {loading ? <div className="h-52 bg-slate-50 rounded-2xl animate-pulse" /> : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 8 }} />
                  <YAxis tickFormatter={(v) => `$${(v / 1e9).toFixed(1)}B`} tick={{ fontSize: 9 }} />
                  <Tooltip formatter={(v) => fmtB(Number(v))} />
                  <Legend formatter={(v) => <span className="text-[10px]">{v}</span>} />
                  <Bar dataKey="Vigente"      fill="#00284d" radius={[4,4,0,0]} />
                  <Bar dataKey="Comprometido" fill="#f59e0b" radius={[4,4,0,0]} />
                  <Bar dataKey="Pagado"       fill="#10b981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-black uppercase tracking-widest text-[#00284d] mb-4">Comparativo histórico por vigencia</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mockVigencias} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradApropiado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00284d" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00284d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradEjecutado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="vigencia" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 9 }} />
                <Tooltip formatter={(v) => `$${Number(v)}B`} />
                <Legend formatter={(v) => <span className="text-[10px]">{v}</span>} />
                <Area type="monotone" dataKey="apropiado" stroke="#00284d" strokeWidth={2} fill="url(#gradApropiado)" name="Apropiado" />
                <Area type="monotone" dataKey="ejecutado" stroke="#10b981" strokeWidth={2} fill="url(#gradEjecutado)" name="Ejecutado" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
