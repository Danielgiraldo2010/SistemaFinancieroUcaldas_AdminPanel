const mockReportes = [
  { nombre: "Ejecución presupuestal Q1 2025",  modulo: "Presupuesto", filas: 1240, generado: "2025-03-31 08:00" },
  { nombre: "Ingresos propios enero-marzo",     modulo: "Ingresos",    filas: 380,  generado: "2025-03-31 08:05" },
  { nombre: "Gastos por rubro acumulado",       modulo: "Gastos",      filas: 620,  generado: "2025-03-31 08:10" },
  { nombre: "CDPs vigentes 2025",               modulo: "Presupuesto", filas: 96,   generado: "2025-03-31 08:15" },
  { nombre: "Logs de auditoría marzo",          modulo: "Auditoría",   filas: 4500, generado: "2025-03-31 08:20" },
];

export default function ExportarXlsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Exportar XLS</h1>
        <p className="text-sm text-slate-500">Reportes disponibles para descarga en formato Excel.</p>
      </div>
      <div className="space-y-3">
        {mockReportes.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between gap-4 hover:border-emerald-200 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800">{r.nombre}</p>
              <p className="text-xs text-slate-400 mt-0.5">{r.modulo} · {r.filas.toLocaleString()} filas · Generado: {r.generado}</p>
            </div>
            <button className="shrink-0 flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm">
              ↓ Descargar XLS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
