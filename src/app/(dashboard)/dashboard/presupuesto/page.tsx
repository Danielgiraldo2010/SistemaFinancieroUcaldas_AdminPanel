"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CatalogoTree } from "@/components/ui";
import { catalogoPresupuestalService, flattenCatalogo } from "@/services/catalogo-presupuestal.service";
import type { CatalogoPresupuestalNodoDto } from "@/core";
import { Landmark, Receipt, TrendingUp } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

export default function PresupuestoInicialPage() {
  const [ingresosTree, setIngresosTree] = useState<CatalogoPresupuestalNodoDto[]>([]);
  const [gastosTree, setGastosTree] = useState<CatalogoPresupuestalNodoDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      catalogoPresupuestalService.getTreeByTipo("ingreso"),
      catalogoPresupuestalService.getTreeByTipo("gasto"),
    ]).then(([ingresos, gastos]) => {
      setIngresosTree(ingresos);
      setGastosTree(gastos);
      setLoading(false);
    });
  }, []);

  const metricas = useMemo(() => {
    const ingresosMov = flattenCatalogo(ingresosTree).filter((n) => n.permite_movimiento);
    const gastosMov = flattenCatalogo(gastosTree).filter((n) => n.permite_movimiento);

    const totalIng = ingresosMov.reduce((s, n) => s + (n.presupuesto_vigente ?? 0), 0);
    const totalGas = gastosMov.reduce((s, n) => s + (n.presupuesto_vigente ?? 0), 0);

    return {
      ingresosMov,
      gastosMov,
      totalIng,
      totalGas,
      balance: totalIng - totalGas,
    };
  }, [ingresosTree, gastosTree]);

  const resumenNivel = useMemo(() => {
    const all = [...metricas.ingresosMov, ...metricas.gastosMov];
    const byLevel = new Map<number, { ingreso: number; gasto: number }>();

    for (const node of all) {
      const row = byLevel.get(node.nivel) ?? { ingreso: 0, gasto: 0 };
      if (node.tipo === "ingreso") row.ingreso += node.presupuesto_vigente ?? 0;
      else row.gasto += node.presupuesto_vigente ?? 0;
      byLevel.set(node.nivel, row);
    }

    return [...byLevel.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([nivel, values]) => ({ nivel, ...values }));
  }, [metricas]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Presupuesto Inicial</h1>
          <p className="text-sm text-slate-500">Vista consolidada con rubros jerarquicos temporales desde catalogo local.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/presupuesto/ingresos" className="flex items-center gap-2 px-4 py-2 bg-[#00284d] text-[#d5bb87] rounded-xl text-[11px] font-black uppercase tracking-widest">
            <Landmark size={14} /> Ingresos
          </Link>
          <Link href="/dashboard/presupuesto/gastos" className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest">
            <Receipt size={14} /> Gastos
          </Link>
          <Link href="/dashboard/presupuesto/ejecucion" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest">
            <TrendingUp size={14} /> Ejecucion
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Total ingresos vigentes" value={loading ? "-" : fmt(metricas.totalIng)} border="border-l-4 border-emerald-400" text="text-emerald-600" />
        <MetricCard label="Total gastos vigentes" value={loading ? "-" : fmt(metricas.totalGas)} border="border-l-4 border-rose-400" text="text-rose-600" />
        <MetricCard label="Balance" value={loading ? "-" : fmt(metricas.balance)} border="border-l-4 border-[#00284d]" text={metricas.balance >= 0 ? "text-[#00284d]" : "text-rose-600"} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <CatalogoTree nodes={ingresosTree} title="Arbol de ingresos" />
        <CatalogoTree nodes={gastosTree} title="Arbol de gastos" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <span className="text-xs font-black uppercase tracking-widest text-[#00284d]">Tabla resumen por nivel</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-[#00284d]">
              <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Nivel</th>
              <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Ingresos</th>
              <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Gastos</th>
              <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {resumenNivel.map((row) => (
              <tr key={row.nivel} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-3 text-xs font-bold text-[#00284d]">Nivel {row.nivel}</td>
                <td className="px-6 py-3 text-xs text-right font-mono text-emerald-700">{fmt(row.ingreso)}</td>
                <td className="px-6 py-3 text-xs text-right font-mono text-rose-600">{fmt(row.gasto)}</td>
                <td className="px-6 py-3 text-xs text-right font-mono font-bold text-slate-700">{fmt(row.ingreso - row.gasto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  border,
  text,
}: {
  label: string;
  value: string;
  border: string;
  text: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 ${border}`}>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`text-2xl font-black mt-1 ${text}`}>{value}</p>
    </div>
  );
}
