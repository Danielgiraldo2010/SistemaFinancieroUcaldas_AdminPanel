const mockIPs = [
  { usuario: "carlos.mejia@ucaldas.edu.co", ip: "192.168.1.45", ubicacion: "Manizales, CO", dispositivo: "Chrome / Windows", ultimaConexion: "2025-03-31 08:12" },
  { usuario: "ana.torres@ucaldas.edu.co", ip: "192.168.1.82", ubicacion: "Manizales, CO", dispositivo: "Firefox / macOS", ultimaConexion: "2025-03-31 07:55" },
  { usuario: "luis.rios@ucaldas.edu.co", ip: "10.0.0.14", ubicacion: "Manizales, CO", dispositivo: "Chrome / Linux", ultimaConexion: "2025-03-30 17:40" },
  { usuario: "maria.gomez@ucaldas.edu.co", ip: "190.24.112.33", ubicacion: "Bogotá, CO", dispositivo: "Safari / iOS", ultimaConexion: "2025-03-30 14:22" },
  { usuario: "admin@ucaldas.edu.co", ip: "192.168.1.1", ubicacion: "Manizales, CO", dispositivo: "Chrome / Windows", ultimaConexion: "2025-03-31 09:01" },
];

export default function AuditoriaIpUsuarioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">IP de Usuario</h1>
        <p className="text-sm text-slate-500">Registro de direcciones IP por usuario en el sistema.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-[#00284d]">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Usuario</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">IP</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Ubicación</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Dispositivo</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Última conexión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockIPs.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 text-xs font-semibold text-slate-800">{r.usuario}</td>
                <td className="px-6 py-4"><span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{r.ip}</span></td>
                <td className="px-6 py-4 text-xs text-slate-500">{r.ubicacion}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{r.dispositivo}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{r.ultimaConexion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
