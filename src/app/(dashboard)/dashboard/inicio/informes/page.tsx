const mockInformes = [
  { id: 1, titulo: "Informe Financiero Q1 2025", tipo: "Financiero", fecha: "2025-03-31", estado: "Aprobado", autor: "Carlos Mejía" },
  { id: 2, titulo: "Ejecución Presupuestal Enero", tipo: "Presupuesto", fecha: "2025-01-31", estado: "Revisión", autor: "Ana Torres" },
  { id: 3, titulo: "Reporte de Gastos Operativos", tipo: "Gastos", fecha: "2025-02-28", estado: "Borrador", autor: "Luis Ríos" },
  { id: 4, titulo: "Informe de Ingresos Propios", tipo: "Ingresos", fecha: "2025-03-15", estado: "Aprobado", autor: "María Gómez" },
  { id: 5, titulo: "Balance General Semestral", tipo: "Financiero", fecha: "2024-12-31", estado: "Aprobado", autor: "Carlos Mejía" },
];

const estadoColor: Record<string, string> = {
  Aprobado: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Revisión: "bg-amber-50 text-amber-700 border-amber-100",
  Borrador: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function InicioInformesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Informes</h1>
        <p className="text-sm text-slate-500">Listado de informes institucionales generados en el sistema.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-[#00284d]">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">#</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Título</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Tipo</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Autor</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Fecha</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockInformes.map((inf) => (
              <tr key={inf.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 text-xs font-bold text-slate-400">{inf.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-800">{inf.titulo}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{inf.tipo}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{inf.autor}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{inf.fecha}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${estadoColor[inf.estado]}`}>
                    {inf.estado}
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
