"use client";

import { useEffect, useState } from "react";
import { presupuestoService } from "@/services";
import type { CdpDto } from "@/core";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const estadoColor: Record<string, string> = {
  Vigente:      "bg-blue-50 text-blue-700 border-blue-100",
  Comprometido: "bg-amber-50 text-amber-700 border-amber-100",
  Anulado:      "bg-red-50 text-red-600 border-red-100",
};

export default function PresupuestoSolicitudesPage() {
  const [cdps, setCdps] = useState<CdpDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    presupuestoService.getCdps().then((res) => {
      setCdps(res as CdpDto[]);
      setLoading(false);
    });
  }, []);

  const totalCdps    = cdps.reduce((s, c) => s + c.valor, 0);
  const vigentes     = cdps.filter((c) => c.estado === "Vigente").length;
  const comprometidos = cdps.filter((c) => c.estado === "Comprometido").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">CDP — Certificados de Disponibilidad</h1>
        <p className="text-sm text-slate-500">Reservas de recursos antes del compromiso jurídico — Vigencia 2025</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Valor total CDPs",  value: fmt(totalCdps),         color: "text-[#00284d]" },
          { label: "Vigentes",          value: `${vigentes}`,          color: "text-blue-600" },
          { label: "Comprometidos",     value: `${comprometidos}`,     color: "text-amber-600" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{m.label}</p>
            <p className={`text-2xl font-black mt-1 ${m.color}`}>{loading ? "—" : m.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-[#00284d]">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">N° CDP</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Rubro</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">Valor</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Fecha</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading
              ? [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-xl" /></td>
                  </tr>
                ))
              : cdps.map((c) => (
                  <tr key={c.id_cdp} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono font-bold text-[#00284d]">{c.numero}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{c.rubro_nombre}</td>
                    <td className="px-6 py-4 text-xs font-mono text-right font-bold text-slate-700">{fmt(c.valor)}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{c.fecha}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${estadoColor[c.estado]}`}>
                        {c.estado}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
