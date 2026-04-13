"use client";

import { useState } from "react";
import { Plus, ExternalLink, X } from "lucide-react";

type Acuerdo = {
  id: number;
  numero: string;
  titulo: string;
  fecha: string;
  enlace: string;
  vigente: boolean;
};

const inicial: Acuerdo[] = [
  { id: 1, numero: "Acuerdo 001-2020", titulo: "Estatuto General de Presupuesto Universitario",          fecha: "2020-03-15", enlace: "https://ucaldas.edu.co/docs/acuerdo-001-2020.pdf", vigente: true  },
  { id: 2, numero: "Acuerdo 012-2021", titulo: "Reglamento de Modificaciones Presupuestales",            fecha: "2021-06-10", enlace: "https://ucaldas.edu.co/docs/acuerdo-012-2021.pdf", vigente: true  },
  { id: 3, numero: "Acuerdo 005-2018", titulo: "Normas de Austeridad del Gasto Público",                 fecha: "2018-09-20", enlace: "https://ucaldas.edu.co/docs/acuerdo-005-2018.pdf", vigente: false },
  { id: 4, numero: "Acuerdo 023-2023", titulo: "Política de Inversión y Fuentes de Financiación",        fecha: "2023-01-25", enlace: "https://ucaldas.edu.co/docs/acuerdo-023-2023.pdf", vigente: true  },
  { id: 5, numero: "Acuerdo 008-2019", titulo: "Procedimiento para Certificados de Disponibilidad",      fecha: "2019-04-12", enlace: "https://ucaldas.edu.co/docs/acuerdo-008-2019.pdf", vigente: false },
];

export default function NormatividadAcuerdosPage() {
  const [acuerdos, setAcuerdos] = useState<Acuerdo[]>(inicial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ numero: "", titulo: "", fecha: "", enlace: "", vigente: true });

  const agregar = () => {
    if (!form.numero || !form.titulo) return;
    setAcuerdos((prev) => [{ ...form, id: prev.length + 1 }, ...prev]);
    setForm({ numero: "", titulo: "", fecha: "", enlace: "", vigente: true });
    setShowForm(false);
  };

  const toggleVigente = (id: number) =>
    setAcuerdos((prev) => prev.map((a) => (a.id === id ? { ...a, vigente: !a.vigente } : a)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Acuerdos</h1>
          <p className="text-sm text-slate-500">Acuerdos que regulan el sistema financiero institucional.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00284d] text-[#d5bb87] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003e70] transition-all shadow-sm"
        >
          <Plus size={14} /> Nuevo acuerdo
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#d5bb87]/40 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-widest text-[#00284d]">Nuevo Acuerdo</span>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "N° Acuerdo", key: "numero",  type: "text" },
              { label: "Fecha",      key: "fecha",   type: "date" },
              { label: "Título",     key: "titulo",  type: "text" },
              { label: "Enlace URL", key: "enlace",  type: "url"  },
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

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-[#00284d]">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">N° Acuerdo</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Título</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Fecha</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Documento</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Vigencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {acuerdos.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 text-xs font-mono font-bold text-[#00284d]">{a.numero}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-800">{a.titulo}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{a.fecha}</td>
                <td className="px-6 py-4">
                  <a href={a.enlace} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
                    <ExternalLink size={12} /> Ver documento
                  </a>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleVigente(a.id)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black border transition-colors ${a.vigente ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
                  >
                    {a.vigente ? "Vigente" : "No vigente"}
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
