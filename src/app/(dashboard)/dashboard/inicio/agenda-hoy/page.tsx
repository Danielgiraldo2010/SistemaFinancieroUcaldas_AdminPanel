const mockAgenda = [
  { hora: "08:00", evento: "Reunión Comité Financiero", lugar: "Sala A - Rectoría", tipo: "Reunión", estado: "Confirmado" },
  { hora: "09:30", evento: "Revisión ejecución presupuestal Q1", lugar: "Virtual - Teams", tipo: "Revisión", estado: "Confirmado" },
  { hora: "11:00", evento: "Entrega informe de ingresos propios", lugar: "Oficina Financiera", tipo: "Entrega", estado: "Pendiente" },
  { hora: "14:00", evento: "Capacitación sistema SAPFIAI", lugar: "Sala de Cómputo 3", tipo: "Capacitación", estado: "Confirmado" },
  { hora: "15:30", evento: "Firma resolución RES-005-2025", lugar: "Despacho Rector", tipo: "Firma", estado: "Pendiente" },
  { hora: "17:00", evento: "Cierre de caja diario", lugar: "Tesorería", tipo: "Operativo", estado: "Confirmado" },
];

const tipoColor: Record<string, string> = {
  Reunión: "bg-blue-50 text-blue-700 border-blue-100",
  Revisión: "bg-purple-50 text-purple-700 border-purple-100",
  Entrega: "bg-amber-50 text-amber-700 border-amber-100",
  Capacitación: "bg-teal-50 text-teal-700 border-teal-100",
  Firma: "bg-rose-50 text-rose-700 border-rose-100",
  Operativo: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function InicioAgendaHoyPage() {
  const hoy = new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Agenda Hoy</h1>
        <p className="text-sm text-slate-500 capitalize">{hoy}</p>
      </div>

      <div className="space-y-3">
        {mockAgenda.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start gap-5 hover:border-[#d5bb87]/50 transition-colors">
            <div className="shrink-0 text-center w-14">
              <span className="text-lg font-black text-[#00284d] font-mono">{item.hora}</span>
            </div>
            <div className="w-px self-stretch bg-[#d5bb87]/30" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800">{item.evento}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.lugar}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${tipoColor[item.tipo]}`}>
                {item.tipo}
              </span>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${item.estado === "Confirmado" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                {item.estado}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
