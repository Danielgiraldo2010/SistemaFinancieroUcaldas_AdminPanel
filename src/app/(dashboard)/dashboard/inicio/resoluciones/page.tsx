const mockResoluciones = [
  { id: "RES-001-2025", asunto: "Aprobación presupuesto operativo 2025", fecha: "2025-01-10", vigencia: "2025-12-31", estado: "Vigente" },
  { id: "RES-002-2025", asunto: "Modificación rubros de inversión", fecha: "2025-02-05", vigencia: "2025-06-30", estado: "Vigente" },
  { id: "RES-003-2025", asunto: "Traslado de recursos entre dependencias", fecha: "2025-02-20", vigencia: "2025-03-31", estado: "Vencida" },
  { id: "RES-004-2025", asunto: "Apertura de crédito adicional", fecha: "2025-03-01", vigencia: "2025-12-31", estado: "Vigente" },
  { id: "RES-005-2025", asunto: "Reducción presupuestal por austeridad", fecha: "2025-03-18", vigencia: "2025-09-30", estado: "En revisión" },
];

const estadoColor: Record<string, string> = {
  Vigente: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Vencida: "bg-red-50 text-red-600 border-red-100",
  "En revisión": "bg-amber-50 text-amber-700 border-amber-100",
};

export default function InicioResolucionesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Resoluciones</h1>
        <p className="text-sm text-slate-500">Resoluciones institucionales registradas en el sistema.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-[#00284d]">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">N° Resolución</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Asunto</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Fecha</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Vigencia</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockResoluciones.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 text-xs font-mono font-bold text-[#00284d]">{res.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-800">{res.asunto}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{res.fecha}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{res.vigencia}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${estadoColor[res.estado]}`}>
                    {res.estado}
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
