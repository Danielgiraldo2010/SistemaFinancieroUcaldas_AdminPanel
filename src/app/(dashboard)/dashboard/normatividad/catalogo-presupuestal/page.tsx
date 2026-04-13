"use client";

import { useState } from "react";
import { Plus, X, ChevronRight } from "lucide-react";

type Catalogo = { id: number; codigo: string; nombre: string; nivel: number; padre: string | null; vigente: boolean };

const inicial: Catalogo[] = [
  { id: 1, codigo: "1",      nombre: "Ingresos",                              nivel: 1, padre: null,  vigente: true  },
  { id: 2, codigo: "1.1",    nombre: "Ingresos Corrientes",                   nivel: 2, padre: "1",   vigente: true  },
  { id: 3, codigo: "1.1.1",  nombre: "Matrículas Pregrado",                   nivel: 3, padre: "1.1", vigente: true  },
  { id: 4, codigo: "1.1.2",  nombre: "Matrículas Posgrado",                   nivel: 3, padre: "1.1", vigente: true  },
  { id: 5, codigo: "2",      nombre: "Gastos",                                nivel: 1, padre: null,  vigente: true  },
  { id: 6, codigo: "2.1",    nombre: "Servicios Personales",                  nivel: 2, padre: "2",   vigente: true  },
  { id: 7, codigo: "2.1.1",  nombre: "Nómina Docente",                        nivel: 3, padre: "2.1", vigente: true  },
  { id: 8, codigo: "2.1.2",  nombre: "Nómina Administrativa",                 nivel: 3, padre: "2.1", vigente: true  },
  { id: 9, codigo: "2.2",    nombre: "Gastos Generales",                      nivel: 2, padre: "2",   vigente: true  },
  { id: 10, codigo: "2.2.1", nombre: "Servicios Públicos",                    nivel: 3, padre: "2.2", vigente: true  },
  { id: 11, codigo: "3",     nombre: "Inversión",                             nivel: 1, padre: null,  vigente: true  },
  { id: 12, codigo: "3.1",   nombre: "Adquisición de Bienes",                 nivel: 2, padre: "3",   vigente: true  },
  { id: 13, codigo: "2.3",   nombre: "Transferencias (derogado)",             nivel: 2, padre: "2",   vigente: false },
];

const nivelPad = ["", "pl-0", "pl-6", "pl-12"];
const nivelSize = ["", "text-sm font-black text-[#00284d]", "text-sm font-bold text-slate-700", "text-sm text-slate-600"];

export default function CatalogoPresupuestalPage() {
  const [items, setItems] = useState<Catalogo[]>(inicial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ codigo: "", nombre: "", padre: "", vigente: true });

  const agregar = () => {
    if (!form.codigo || !form.nombre) return;
    const nivel = form.codigo.split(".").length;
    setItems((prev) => [...prev, { id: prev.length + 1, codigo: form.codigo, nombre: form.nombre, nivel, padre: form.padre || null, vigente: form.vigente }]);
    setForm({ codigo: "", nombre: "", padre: "", vigente: true });
    setShowForm(false);
  };

  const toggleVigente = (id: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, vigente: !i.vigente } : i)));

  const sorted = [...items].sort((a, b) => a.codigo.localeCompare(b.codigo));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Catálogo Presupuestal</h1>
          <p className="text-sm text-slate-500">Estructura jerárquica del presupuesto institucional.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#00284d] text-[#d5bb87] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003e70] transition-all shadow-sm">
          <Plus size={14} /> Nuevo ítem
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#d5bb87]/40 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-widest text-[#00284d]">Nuevo Ítem del Catálogo</span>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Código (ej: 2.2.3)", key: "codigo" },
              { label: "Nombre",             key: "nombre" },
              { label: "Código padre",       key: "padre"  },
            ].map(({ label, key }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40"
                />
              </div>
            ))}
          </div>
          <button onClick={agregar} className="px-5 py-2 bg-[#00284d] text-[#d5bb87] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003e70] transition-all">
            Guardar
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-[#00284d]">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Código</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Nombre</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Nivel</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((item) => (
              <tr key={item.id} className={`hover:bg-slate-50/60 transition-colors ${!item.vigente ? "opacity-50" : ""}`}>
                <td className={`px-6 py-3 font-mono text-xs font-bold text-[#00284d] ${nivelPad[item.nivel]}`}>
                  <span className="flex items-center gap-1">
                    {item.nivel > 1 && <ChevronRight size={10} className="text-slate-300" />}
                    {item.codigo}
                  </span>
                </td>
                <td className={`px-6 py-3 ${nivelSize[item.nivel]} ${nivelPad[item.nivel]}`}>{item.nombre}</td>
                <td className="px-6 py-3 text-xs text-slate-400">{item.nivel}° nivel</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => toggleVigente(item.id)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black border transition-colors ${item.vigente ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
                  >
                    {item.vigente ? "Vigente" : "No vigente"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
