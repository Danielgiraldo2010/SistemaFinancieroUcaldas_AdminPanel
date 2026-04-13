"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ArrowLeft, Landmark } from "lucide-react";
import { catalogoPresupuestalService } from "@/services";
import type { CatalogoPresupuestalNodoDto } from "@/core";

function NuevoIngresoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codigo = searchParams.get("codigo") ?? "";
  const [nodo, setNodo] = useState<CatalogoPresupuestalNodoDto | null>(null);
  const [rubrosDisponibles, setRubrosDisponibles] = useState<CatalogoPresupuestalNodoDto[]>([]);

  const [form, setForm] = useState({
    rubro: codigo,
    codigo,
    fuente: "",
    centro: "",
    valor: "",
    fecha: new Date().toISOString().split("T")[0],
    descripcion: "",
  });

  useEffect(() => {
    catalogoPresupuestalService.getMovimientoNodes("ingreso").then((movimientoNodes) => {
      setRubrosDisponibles(movimientoNodes);

      const selected = codigo
        ? movimientoNodes.find((n) => n.codigo === codigo) ?? movimientoNodes[0]
        : movimientoNodes[0];

      if (!selected) return;

      setNodo(selected);
      setForm((prev) => ({
        ...prev,
        rubro: selected.codigo,
        codigo: selected.codigo,
        valor: prev.valor || String(selected.apropiacion_inicial ?? 0),
      }));
    });
  }, [codigo]);

  const onSelectRubro = (codigoRubro: string) => {
    const selected = rubrosDisponibles.find((n) => n.codigo === codigoRubro) ?? null;
    setNodo(selected);
    setForm((prev) => ({
      ...prev,
      rubro: codigoRubro,
      codigo: codigoRubro,
      valor: selected ? String(selected.apropiacion_inicial ?? 0) : prev.valor,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selected = rubrosDisponibles.find((n) => n.codigo === form.rubro) ?? nodo;
    // TODO: conectar con presupuestoService cuando el endpoint esté listo
    alert(`Ingreso registrado (mock):\n${JSON.stringify({ ...form, rubro_nombre: selected?.nombre ?? "" }, null, 2)}`);
    router.push("/dashboard/presupuesto/ingresos");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">
            Nuevo Ingreso
          </h1>
          <p className="text-sm text-slate-500">Registro desde rubro jerarquico seleccionado.</p>
        </div>
      </div>

      {/* Badge categoría */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#00284d]/5 border border-[#00284d]/10 rounded-2xl w-fit">
        <Landmark size={14} className="text-[#00284d]" />
        <span className="text-xs font-black uppercase tracking-widest text-[#00284d]">
          {nodo ? `${nodo.codigo} · ${nodo.nombre}` : "Sin nodo seleccionado"}
        </span>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Rubro */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Rubro
            </label>
            <select
              value={form.rubro}
              onChange={(e) => onSelectRubro(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/50 focus:border-[#d5bb87]"
            >
              {rubrosDisponibles.map((r) => (
                <option key={r.codigo} value={r.codigo}>{`${r.codigo} - ${r.nombre}`}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Codigo presupuestal
            </label>
            <input
              value={form.codigo}
              disabled
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50"
            />
          </div>

          {/* Fuente */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Fuente de financiación
            </label>
            <select
              value={form.fuente}
              onChange={(e) => setForm((f) => ({ ...f, fuente: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/50 focus:border-[#d5bb87]"
            >
              <option value="">Seleccionar...</option>
              <option value="1">Transferencias Nación</option>
              <option value="2">Recursos Propios</option>
              <option value="3">Estampilla Pro-Universidad</option>
              <option value="4">Convenios</option>
            </select>
          </div>

          {/* Centro costo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Centro de costo
            </label>
            <select
              value={form.centro}
              onChange={(e) => setForm((f) => ({ ...f, centro: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/50 focus:border-[#d5bb87]"
            >
              <option value="">Seleccionar...</option>
              <option value="1">Rectoría</option>
              <option value="2">Ing. de Sistemas</option>
              <option value="3">Bienestar Univ.</option>
              <option value="4">Investigación</option>
            </select>
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Fecha
            </label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/50 focus:border-[#d5bb87]"
            />
          </div>

          {/* Valor */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Valor apropiación inicial (COP)
            </label>
            <input
              type="number"
              placeholder="0"
              value={form.valor}
              onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
              required
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/50 focus:border-[#d5bb87]"
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Descripción (opcional)
            </label>
            <textarea
              rows={3}
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/50 focus:border-[#d5bb87] resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!nodo?.permite_movimiento}
            className="px-6 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003e70] transition-all shadow-sm"
          >
            Guardar ingreso
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NuevoIngresoPage() {
  return (
    <Suspense>
      <NuevoIngresoForm />
    </Suspense>
  );
}
