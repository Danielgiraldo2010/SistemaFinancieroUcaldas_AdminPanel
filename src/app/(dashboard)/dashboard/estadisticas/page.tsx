"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { catalogoPresupuestalService, flattenCatalogo } from "@/services/catalogo-presupuestal.service";
import type { CatalogoPresupuestalNodoDto, CatalogoTipo } from "@/core";

const fmtB = (n: number) => `$${(n / 1_000_000_000).toFixed(1)}B`;
const COLORS = ["#00284d", "#d5bb87", "#10b981", "#f59e0b", "#6366f1", "#f43f5e", "#06b6d4"];

export default function EstadisticasPage() {
  const [nodes, setNodes] = useState<CatalogoPresupuestalNodoDto[]>([]);
  const [tipo, setTipo] = useState<"todos" | CatalogoTipo>("todos");
  const [nivel, setNivel] = useState<number | "todos">("todos");
  const [unidad, setUnidad] = useState<string>("todas");

  useEffect(() => {
    catalogoPresupuestalService.getTree().then((tree) => setNodes(flattenCatalogo(tree).filter((n) => n.permite_movimiento)));
  }, []);

  const unidades = useMemo(() => [...new Set(nodes.map((n) => n.unidad_ejecutora || "No definida"))], [nodes]);
  const niveles = useMemo(() => [...new Set(nodes.map((n) => n.nivel))].sort((a, b) => a - b), [nodes]);

  const filtered = useMemo(() => {
    return nodes.filter((n) => {
      if (tipo !== "todos" && n.tipo !== tipo) return false;
      if (nivel !== "todos" && n.nivel !== nivel) return false;
      if (unidad !== "todas" && (n.unidad_ejecutora || "No definida") !== unidad) return false;
      return true;
    });
  }, [nodes, tipo, nivel, unidad]);

  const pieByTipo = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const row of filtered) {
      const key = row.tipo === "ingreso" ? "Ingreso" : "Gasto";
      grouped.set(key, (grouped.get(key) ?? 0) + (row.presupuesto_vigente ?? 0));
    }
    return [...grouped.entries()].map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const barByRubro = useMemo(() => {
    return filtered
      .slice()
      .sort((a, b) => (b.presupuesto_vigente ?? 0) - (a.presupuesto_vigente ?? 0))
      .slice(0, 8)
      .map((row) => ({
        name: row.nombre.length > 20 ? `${row.nombre.slice(0, 20)}...` : row.nombre,
        Inicial: row.apropiacion_inicial ?? 0,
        Vigente: row.presupuesto_vigente ?? 0,
      }));
  }, [filtered]);

  const byUnidad = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const row of filtered) {
      const key = row.unidad_ejecutora || "No definida";
      grouped.set(key, (grouped.get(key) ?? 0) + (row.presupuesto_vigente ?? 0));
    }
    return [...grouped.entries()].map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const totalInicial = filtered.reduce((s, n) => s + (n.apropiacion_inicial ?? 0), 0);
  const totalVigente = filtered.reduce((s, n) => s + (n.presupuesto_vigente ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Estadisticas</h1>
        <p className="text-sm text-slate-500">Analitica basada en rubros jerarquicos de la fuente temporal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select value={tipo} onChange={(e) => setTipo(e.target.value as "todos" | CatalogoTipo)} className="border border-slate-200 rounded-xl px-3 py-2 text-xs">
          <option value="todos">Tipo: todos</option>
          <option value="ingreso">Ingreso</option>
          <option value="gasto">Gasto</option>
        </select>
        <select value={String(nivel)} onChange={(e) => setNivel(e.target.value === "todos" ? "todos" : Number(e.target.value))} className="border border-slate-200 rounded-xl px-3 py-2 text-xs">
          <option value="todos">Nivel estructural: todos</option>
          {niveles.map((n) => <option key={n} value={n}>{`Nivel ${n}`}</option>)}
        </select>
        <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-xs md:col-span-2">
          <option value="todas">Unidad ejecutora: todas</option>
          {unidades.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Rubros filtrados" value={String(filtered.length)} />
        <StatCard label="Apropiacion inicial" value={fmtB(totalInicial)} />
        <StatCard label="Presupuesto vigente" value={fmtB(totalVigente)} />
        <StatCard label="Variacion" value={fmtB(totalVigente - totalInicial)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <p className="text-xs font-black uppercase tracking-widest text-[#00284d] mb-4">Torta por tipo de presupuesto</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieByTipo} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="value">
                {pieByTipo.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmtB(Number(v))} />
              <Legend formatter={(v) => <span className="text-[10px] text-slate-600">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <p className="text-xs font-black uppercase tracking-widest text-[#00284d] mb-4">Distribucion por unidad ejecutora</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byUnidad} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tickFormatter={(v) => fmtB(Number(v))} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v) => fmtB(Number(v))} />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} name="Vigente" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <p className="text-xs font-black uppercase tracking-widest text-[#00284d] mb-4">Comparacion apropiacion inicial vs presupuesto vigente</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barByRubro} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 9 }} />
            <YAxis tickFormatter={(v) => fmtB(Number(v))} tick={{ fontSize: 9 }} />
            <Tooltip formatter={(v) => fmtB(Number(v))} />
            <Legend formatter={(v) => <span className="text-[10px]">{v}</span>} />
            <Bar dataKey="Inicial" fill="#00284d" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Vigente" fill="#d5bb87" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 border-l-4 border-[#00284d]">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-2xl font-black text-[#00284d] mt-1">{value}</p>
    </div>
  );
}
