const mockReportes = [
  { nombre: "Informe financiero Q1 2025",    modulo: "Financiero",   paginas: 24, generado: "2025-03-31 09:00" },
  { nombre: "Resoluciones vigentes 2025",    modulo: "Resoluciones", paginas: 8,  generado: "2025-03-31 09:05" },
  { nombre: "Balance general semestral",     modulo: "Presupuesto",  paginas: 16, generado: "2025-03-31 09:10" },
  { nombre: "Reporte de auditoría mensual",  modulo: "Auditoría",    paginas: 32, generado: "2025-03-31 09:15" },
  { nombre: "Estadísticas institucionales",  modulo: "Estadísticas", paginas: 12, generado: "2025-03-31 09:20" },
];

export default function ExportarPdfPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Exportar PDF</h1>
        <p className="text-sm text-slate-500">Reportes disponibles para descarga en formato PDF.</p>
      </div>
      <div className="space-y-3">
        {mockReportes.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between gap-4 hover:border-rose-200 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800">{r.nombre}</p>
              <p className="text-xs text-slate-400 mt-0.5">{r.modulo} · {r.paginas} páginas · Generado: {r.generado}</p>
            </div>
            <button className="shrink-0 flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-sm">
              ↓ Descargar PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
