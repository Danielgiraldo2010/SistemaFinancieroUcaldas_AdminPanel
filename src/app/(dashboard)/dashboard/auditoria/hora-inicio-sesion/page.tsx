const mockSesiones = [
  { usuario: "admin@ucaldas.edu.co", inicio: "2025-03-31 08:01:14", fin: "2025-03-31 12:30:00", duracion: "4h 28m", estado: "Cerrada" },
  { usuario: "carlos.mejia@ucaldas.edu.co", inicio: "2025-03-31 08:12:05", fin: "—", duracion: "Activa", estado: "Activa" },
  { usuario: "ana.torres@ucaldas.edu.co", inicio: "2025-03-31 07:55:42", fin: "2025-03-31 11:00:00", duracion: "3h 04m", estado: "Cerrada" },
  { usuario: "luis.rios@ucaldas.edu.co", inicio: "2025-03-30 17:40:10", fin: "2025-03-30 18:15:00", duracion: "34m", estado: "Cerrada" },
  { usuario: "maria.gomez@ucaldas.edu.co", inicio: "2025-03-30 14:22:33", fin: "2025-03-30 16:00:00", duracion: "1h 37m", estado: "Cerrada" },
  { usuario: "carlos.mejia@ucaldas.edu.co", inicio: "2025-03-30 09:00:00", fin: "2025-03-30 13:45:00", duracion: "4h 45m", estado: "Cerrada" },
];

export default function AuditoriaHoraInicioSesionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Hora de Inicio de Sesión</h1>
        <p className="text-sm text-slate-500">Registro de sesiones de acceso al sistema.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-[#00284d]">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Usuario</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Inicio</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Fin</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Duración</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockSesiones.map((s, i) => (
              <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 text-xs font-semibold text-slate-800">{s.usuario}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-600">{s.inicio}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{s.fin}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-700">{s.duracion}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${s.estado === "Activa" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {s.estado}
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
