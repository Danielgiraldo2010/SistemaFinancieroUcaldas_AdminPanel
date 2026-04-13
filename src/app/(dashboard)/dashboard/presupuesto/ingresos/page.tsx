"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { catalogoPresupuestalService, presupuestoService } from "@/services";
import type { CatalogoPresupuestalNodoDto, PresupuestoDto } from "@/core";
import { CatalogoTree, Modal } from "@/components/ui";
import {
  Landmark, Receipt,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";

const fmt  = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
const fmtB = (n: number) => `$${(n / 1_000_000_000).toFixed(1)}B`;
const COLORS = ["#00284d", "#d5bb87", "#10b981", "#f59e0b", "#6366f1", "#f43f5e"];

export default function PresupuestoIngresosPage() {
  const router = useRouter();
  const [data, setData] = useState<PresupuestoDto[]>([]);
  const [catalogoIngresos, setCatalogoIngresos] = useState<CatalogoPresupuestalNodoDto[]>([]);
  const [selectedIngreso, setSelectedIngreso] = useState<CatalogoPresupuestalNodoDto | null>(null);
  const [modalIngreso, setModalIngreso] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      presupuestoService.getPresupuestos(1),
      catalogoPresupuestalService.getTreeByTipo("ingreso"),
    ]).then(([res, ingresosTree]) => {
      setData((res as PresupuestoDto[]).filter((p) => p.rubro_tipo === "Ingreso"));
      setCatalogoIngresos(ingresosTree);
      setLoading(false);
    });
  }, []);

  const totalApropiado = data.reduce((s, r) => s + r.apropiacion_inicial, 0);
  const totalVigente   = data.reduce((s, r) => s + r.presupuesto_vigente, 0);

  const pieData = data.map((r) => ({ name: r.rubro_nombre, value: r.apropiacion_inicial }));
  const barData = data.map((r) => ({
    name: r.rubro_nombre.length > 18 ? r.rubro_nombre.slice(0, 18) + "…" : r.rubro_nombre,
    Apropiado: r.apropiacion_inicial,
    Vigente:   r.presupuesto_vigente,
  }));
  const lineData = [
    { mes: "Ene", ejecutado: 1200000000 },
    { mes: "Feb", ejecutado: 2800000000 },
    { mes: "Mar", ejecutado: 3980000000 },
    { mes: "Abr", ejecutado: 4500000000 },
    { mes: "May", ejecutado: 5100000000 },
    { mes: "Jun", ejecutado: 5730000000 },
  ];

  const irANuevoIngreso = () => {
    if (!selectedIngreso?.permite_movimiento) return;
    setModalIngreso(false);
    router.push(`/dashboard/presupuesto/ingresos/nuevo?codigo=${selectedIngreso.codigo}`);
  };

  return (
    <>
      <Modal
        open={modalIngreso}
        onClose={() => setModalIngreso(false)}
        title="Nuevo ingreso"
        subtitle="Selecciona un nodo del arbol con movimiento habilitado"
      >
        <div className="space-y-4">
          <CatalogoTree
            nodes={catalogoIngresos}
            title="Seleccion jerarquica de ingresos"
            onSelectMovimiento={setSelectedIngreso}
            selectedCodigo={selectedIngreso?.codigo ?? null}
          />
          <button
            onClick={irANuevoIngreso}
            disabled={!selectedIngreso}
            className="w-full px-4 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
          >
            Continuar con nodo seleccionado
          </button>
        </div>
      </Modal>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Ingresos</h1>
            <p className="text-sm text-slate-500">Matrículas, cohortes y fuentes de ingreso — Vigencia 2025</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setModalIngreso(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#003e70] transition-all shadow-md"
            >
              <Landmark size={15} /> Nuevo ingreso
            </button>
            <Link
              href="/dashboard/presupuesto/gastos/nuevo"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-rose-600 border border-rose-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm"
            >
              <Receipt size={15} /> Nuevo gasto
            </Link>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Apropiación inicial", value: fmt(totalApropiado), color: "text-[#00284d]",   border: "border-l-4 border-[#00284d]" },
            { label: "Presupuesto vigente", value: fmt(totalVigente),   color: "text-emerald-600", border: "border-l-4 border-emerald-400" },
            { label: "Rubros de ingreso",   value: `${data.length}`,    color: "text-slate-700",   border: "border-l-4 border-[#d5bb87]" },
          ].map((m) => (
            <div key={m.label} className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 ${m.border}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{m.label}</p>
              <p className={`text-2xl font-black mt-1 ${m.color}`}>{loading ? "—" : m.value}</p>
            </div>
          ))}
        </div>

        <CatalogoTree
          nodes={catalogoIngresos}
          title="Arbol de ingresos (fuente temporal catalogo_presupuestal_mock.json)"
          onSelectMovimiento={() => undefined}
        />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <span className="text-xs font-black uppercase tracking-widest text-[#00284d]">Detalle de rubros de ingreso</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-[#00284d]">
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Rubro</th>
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Fuente</th>
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest">Centro costo</th>
                <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Apropiación inicial</th>
                <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-widest">Vigente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? [1, 2].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-xl" /></td>
                    </tr>
                  ))
                : data.map((r) => (
                    <tr key={r.id_presupuesto} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">{r.rubro_nombre}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{r.fuente_nombre}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{r.centro_nombre}</td>
                      <td className="px-6 py-4 text-xs font-mono text-right text-slate-600">{fmt(r.apropiacion_inicial)}</td>
                      <td className="px-6 py-4 text-xs font-mono text-right font-bold text-emerald-700">{fmt(r.presupuesto_vigente)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
            Resumen de información de ingresos
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-black uppercase tracking-widest text-[#00284d] mb-4">Distribución por rubro</p>
              {loading ? <div className="h-48 bg-slate-50 rounded-2xl animate-pulse" /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmtB(Number(v))} />
                    <Legend formatter={(v) => <span className="text-[10px] text-slate-600">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-black uppercase tracking-widest text-[#00284d] mb-4">Apropiado vs Vigente</p>
              {loading ? <div className="h-48 bg-slate-50 rounded-2xl animate-pulse" /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1e9).toFixed(1)}B`} tick={{ fontSize: 9 }} />
                    <Tooltip formatter={(v) => fmtB(Number(v))} />
                    <Legend formatter={(v) => <span className="text-[10px]">{v}</span>} />
                    <Bar dataKey="Apropiado" fill="#00284d" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Vigente"   fill="#d5bb87" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-black uppercase tracking-widest text-[#00284d] mb-4">Ejecución acumulada 2025</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={lineData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 9 }} />
                  <YAxis tickFormatter={(v) => `$${(v / 1e9).toFixed(1)}B`} tick={{ fontSize: 9 }} />
                  <Tooltip formatter={(v) => fmtB(Number(v))} />
                  <Line type="monotone" dataKey="ejecutado" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} name="Ejecutado" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
