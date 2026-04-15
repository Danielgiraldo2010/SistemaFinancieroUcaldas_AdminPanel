"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { catalogoPresupuestalService, presupuestoService } from "@/services";
import type { CatalogoPresupuestalNodoDto, EjecucionPresupuestalDto } from "@/core";
import { CatalogoTree } from "@/components/ui";
import { Receipt } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const fmt  = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
const fmtB = (n: number) => `$${(n / 1_000_000_000).toFixed(1)}B`;

const COLORS = ["#00284d", "#d5bb87", "#10b981", "#f59e0b", "#6366f1", "#f43f5e", "#06b6d4"];

export default function PresupuestoGastosPage() {
  const [data, setData] = useState<EjecucionPresupuestalDto[]>([]);
  const [catalogoGastos, setCatalogoGastos] = useState<CatalogoPresupuestalNodoDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      presupuestoService.getEjecucion(),
      catalogoPresupuestalService.getTreeByTipo("gasto"),
    ]).then(([res, gastosTree]) => {
      setData((res as EjecucionPresupuestalDto[]).filter((r) => r.rubro_tipo !== "Ingreso"));
      setCatalogoGastos(gastosTree);
      setLoading(false);
    });
  }, []);

  const totalApropiado = data.reduce((s, r) => s + r.apropiacion_inicial, 0);
  const totalPagado    = data.reduce((s, r) => s + r.pagado, 0);
  const totalDisp      = data.reduce((s, r) => s + r.disponible, 0);

  const pieData = data.map((r) => ({ name: r.rubro_nombre, value: r.apropiacion_inicial }));
  const barData = data.map((r) => ({
    name: r.rubro_nombre.length > 16 ? r.rubro_nombre.slice(0, 16) + "…" : r.rubro_nombre,
    Apropiado:    r.apropiacion_inicial,
    Comprometido: r.comprometido,
    Pagado:       r.pagado,
  }));

  return (
    <>
      <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/presupuesto/gastos/nuevo"
          className="tour-gastos-nuevo flex items-center gap-2 px-5 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#003e70] transition-all shadow-md"
        >
          <Receipt size={15} /> Nuevo gasto
        </Link>
      </div>

      <CatalogoTree
        nodes={catalogoGastos}
        title="Arbol de gastos (fuente temporal catalogo_presupuestal_mock.json)"
        onSelectMovimiento={() => undefined}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total apropiado", value: fmt(totalApropiado), color: "text-[#00284d]",   border: "border-l-4 border-[#00284d]" },
          { label: "Total pagado",    value: fmt(totalPagado),    color: "text-rose-600",    border: "border-l-4 border-rose-400" },
          { label: "Disponible",      value: fmt(totalDisp),      color: "text-slate-700",   border: "border-l-4 border-[#d5bb87]" },
        ].map((m) => (
          <div key={m.label} className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 ${m.border}`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{m.label}</p>
            <p className={`text-2xl font-black mt-1 ${m.color}`}>{loading ? "—" : m.value}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <span className="text-xs font-black uppercase tracking-widest text-[#00284d]">Detalle de rubros de gasto</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-[#00284d]">
              <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Rubro</th>
              <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Tipo</th>
              <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Apropiado</th>
              <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Comprometido</th>
              <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Pagado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading
              ? [1,2,3].map((i) => <tr key={i} className="animate-pulse"><td colSpan={5} className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-xl" /></td></tr>)
              : data.map((r) => (
                  <tr key={r.id_presupuesto} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{r.rubro_nombre}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{r.rubro_tipo}</td>
                    <td className="px-6 py-4 text-xs font-mono text-right text-slate-600">{fmt(r.apropiacion_inicial)}</td>
                    <td className="px-6 py-4 text-xs font-mono text-right text-amber-700">{fmt(r.comprometido)}</td>
                    <td className="px-6 py-4 text-xs font-mono text-right font-bold text-rose-600">{fmt(r.pagado)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Panel analítico */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Resumen de información de gastos</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-black uppercase tracking-widest text-[#00284d] mb-4">Distribución del gasto por rubro</p>
            {loading ? <div className="h-52 bg-slate-50 rounded-2xl animate-pulse" /> : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmtB(Number(v))} />
                  <Legend formatter={(v) => <span className="text-[10px] text-slate-600">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-black uppercase tracking-widest text-[#00284d] mb-4">Apropiado vs Comprometido vs Pagado</p>
            {loading ? <div className="h-52 bg-slate-50 rounded-2xl animate-pulse" /> : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 8 }} />
                  <YAxis tickFormatter={(v) => `$${(v / 1e9).toFixed(1)}B`} tick={{ fontSize: 9 }} />
                  <Tooltip formatter={(v) => fmtB(Number(v))} />
                  <Legend formatter={(v) => <span className="text-[10px]">{v}</span>} />
                  <Bar dataKey="Apropiado"    fill="#00284d" radius={[4,4,0,0]} />
                  <Bar dataKey="Comprometido" fill="#f59e0b" radius={[4,4,0,0]} />
                  <Bar dataKey="Pagado"       fill="#f43f5e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
