"use client";

import { useState } from "react";
import { Plus, ExternalLink, X, BookOpen } from "lucide-react";

type Documento = { id: number; titulo: string; version: string; fecha: string; enlace: string; vigente: boolean };

const inicial: Documento[] = [
  { id: 1, titulo: "Manual de Presupuesto Público Universitario", version: "v3.2", fecha: "2024-01-15", enlace: "https://ucaldas.edu.co/docs/manual-presupuesto-v3.2.pdf", vigente: true  },
  { id: 2, titulo: "Guía de Ejecución Presupuestal",              version: "v2.0", fecha: "2023-06-01", enlace: "https://ucaldas.edu.co/docs/guia-ejecucion-v2.pdf",        vigente: true  },
  { id: 3, titulo: "Procedimiento CDP y RP",                      version: "v1.5", fecha: "2022-03-10", enlace: "https://ucaldas.edu.co/docs/proc-cdp-rp-v1.5.pdf",         vigente: true  },
  { id: 4, titulo: "Manual de Presupuesto (versión anterior)",    version: "v2.1", fecha: "2021-01-01", enlace: "https://ucaldas.edu.co/docs/manual-presupuesto-v2.1.pdf",   vigente: false },
];

export default function ManualPresupuestoPage() {
  const [docs, setDocs] = useState<Documento[]>(inicial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titulo: "", version: "", fecha: "", enlace: "", vigente: true });

  const agregar = () => {
    if (!form.titulo) return;
    setDocs((prev) => [{ ...form, id: prev.length + 1 }, ...prev]);
    setForm({ titulo: "", version: "", fecha: "", enlace: "", vigente: true });
    setShowForm(false);
  };

  const toggleVigente = (id: number) =>
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, vigente: !d.vigente } : d)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Manual de Presupuesto</h1>
          <p className="text-sm text-slate-500">Documentos normativos del proceso presupuestal institucional.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#00284d] text-[#d5bb87] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003e70] transition-all shadow-sm">
          <Plus size={14} /> Agregar documento
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#d5bb87]/40 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-widest text-[#00284d]">Nuevo Documento</span>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Título",    key: "titulo",  type: "text" },
              { label: "Versión",   key: "version", type: "text" },
              { label: "Fecha",     key: "fecha",   type: "date" },
              { label: "Enlace URL",key: "enlace",  type: "url"  },
            ].map(({ label, key, type }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">¿Vigente?</label>
            <button
              onClick={() => setForm((f) => ({ ...f, vigente: !f.vigente }))}
              className={`px-3 py-1 rounded-lg text-[10px] font-black border transition-colors ${form.vigente ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}
            >
              {form.vigente ? "Sí" : "No"}
            </button>
          </div>
          <button onClick={agregar} className="px-5 py-2 bg-[#00284d] text-[#d5bb87] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003e70] transition-all">
            Guardar
          </button>
        </div>
      )}

      <div className="space-y-3">
        {docs.map((d) => (
          <div key={d.id} className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-5 transition-colors ${d.vigente ? "border-slate-200 hover:border-[#d5bb87]/50" : "border-slate-100 opacity-60"}`}>
            <div className={`p-3 rounded-xl shrink-0 ${d.vigente ? "bg-[#00284d]" : "bg-slate-200"}`}>
              <BookOpen size={18} className={d.vigente ? "text-[#d5bb87]" : "text-slate-400"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800">{d.titulo}</p>
              <p className="text-xs text-slate-400 mt-0.5">{d.version} · Publicado: {d.fecha}</p>
            </div>
            <a href={d.enlace} target="_blank" rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
              <ExternalLink size={12} /> Ver
            </a>
            <button
              onClick={() => toggleVigente(d.id)}
              className={`shrink-0 px-3 py-1 rounded-lg text-[10px] font-black border transition-colors ${d.vigente ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
            >
              {d.vigente ? "Vigente" : "No vigente"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
