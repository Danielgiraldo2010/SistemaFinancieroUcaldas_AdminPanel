const mockActividad = [
  { usuario: "admin@ucaldas.edu.co", accion: "Creó resolución RES-005-2025", modulo: "Resoluciones", fecha: "2025-03-31 09:15:22", tipo: "Creación" },
  { usuario: "carlos.mejia@ucaldas.edu.co", accion: "Aprobó solicitud SOL-004", modulo: "Solicitudes", fecha: "2025-03-31 08:45:10", tipo: "Aprobación" },
  { usuario: "ana.torres@ucaldas.edu.co", accion: "Exportó reporte XLS de ingresos", modulo: "Informes", fecha: "2025-03-31 08:30:05", tipo: "Exportación" },
  { usuario: "admin@ucaldas.edu.co", accion: "Modificó rubro de inversión", modulo: "Presupuesto", fecha: "2025-03-31 08:20:00", tipo: "Modificación" },
  { usuario: "luis.rios@ucaldas.edu.co", accion: "Rechazó solicitud SOL-005", modulo: "Solicitudes", fecha: "2025-03-30 17:50:33", tipo: "Rechazo" },
  { usuario: "maria.gomez@ucaldas.edu.co", accion: "Generó informe financiero Q1", modulo: "Informes", fecha: "2025-03-30 15:10:44", tipo: "Creación" },
  { usuario: "carlos.mejia@ucaldas.edu.co", accion: "Actualizó datos de ejecución", modulo: "Presupuesto", fecha: "2025-03-30 11:05:18", tipo: "Modificación" },
];

const tipoColor: Record<string, string> = {
  Creación: "bg-blue-50 text-blue-700 border-blue-100",
  Aprobación: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Exportación: "bg-purple-50 text-purple-700 border-purple-100",
  Modificación: "bg-amber-50 text-amber-700 border-amber-100",
  Rechazo: "bg-red-50 text-red-600 border-red-100",
};

export default function AuditoriaHistorialActividadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Historial de Actividad</h1>
        <p className="text-sm text-slate-500">Registro consolidado de operaciones realizadas en el sistema.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-[#00284d]">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Usuario</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Acción</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Módulo</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Tipo</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockActividad.map((a, i) => (
              <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 text-xs font-semibold text-slate-800">{a.usuario}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{a.accion}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{a.modulo}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${tipoColor[a.tipo]}`}>
                    {a.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{a.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
