"use client";

import { useEffect, useState } from "react";
import { authenticationService } from "@/lib/api/services";
import {
  History,
  Search,
  Download,
  User,
  Globe,
  Clock,
  Activity,
  FileSearch,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      // Simulación de carga para efectos visuales (puedes quitar el timeout)
      const data = await authenticationService.authenticationall({
        pageNumber: 1,
        pageSize: 20,
      });
      setLogs(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* CABECERA CON ACCIONES RÁPIDAS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[#00284d] rounded-2xl shadow-xl shadow-[#00284d]/20">
            <History size={28} className="text-[#d5bb87]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#00284d] tracking-tight uppercase">
              Logs de Auditoría
            </h1>
            <p className="text-slate-500 text-sm font-medium italic">
              Trazabilidad histórica de operaciones en el ecosistema SAPFIAI.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              size={16}
              className="absolute left-4 top-3 text-slate-400 group-focus-within:text-[#00284d] transition-colors"
            />
            <input
              type="text"
              placeholder="Filtrar por usuario o acción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#d5bb87]/10 focus:border-[#d5bb87] transition-all w-64 shadow-sm"
            />
          </div>
          <button
            onClick={loadLogs}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Refrescar datos"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
            <Download size={16} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* CONTENEDOR DE TABLA ESTILO TERMINAL */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[#00284d]">
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[2px]">
                  <div className="flex items-center gap-2">
                    <User size={14} /> Usuario Administrador
                  </div>
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[2px]">
                  <div className="flex items-center gap-2">
                    <Activity size={14} /> Acción Ejecutada
                  </div>
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[2px]">
                  <div className="flex items-center gap-2">
                    <Globe size={14} /> Origen (IP)
                  </div>
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[2px]">
                  <div className="flex items-center gap-2 justify-end">
                    <Clock size={14} /> Marca de Tiempo
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? [1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-6">
                        <div className="h-8 bg-slate-100 rounded-xl w-full" />
                      </td>
                    </tr>
                  ))
                : filteredLogs.map((log, i) => (
                    <motion.tr
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={i}
                      className="hover:bg-[#efd9af]/5 transition-colors group cursor-default"
                    >
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-800">
                            {log.userEmail || "SISTEMA"}
                          </span>
                          <span className="text-[9px] text-[#b5a27c] font-bold uppercase tracking-tighter">
                            ID: #{Math.floor(Math.random() * 10000)}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tight border ${
                              log.action.includes("Login") ||
                              log.action.includes("Habilitado")
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-blue-50 text-blue-700 border-blue-100"
                            }`}
                          >
                            {log.action}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shadow-sm">
                          {log.ipAddress}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-slate-700">
                            {new Date(log.timestamp).toLocaleDateString(
                              "es-CO",
                              { day: "2-digit", month: "short" },
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium tracking-widest">
                            {new Date(log.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="p-8 bg-slate-50 rounded-[3rem]">
              <FileSearch size={64} className="text-slate-200" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[4px]">
              Sin registros encontrados
            </p>
          </div>
        )}

        {/* PAGINACIÓN ESTÉTICA */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Mostrando registros del 1 al {filteredLogs.length}
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-not-allowed">
              Anterior
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#00284d] hover:bg-[#00284d] hover:text-[#d5bb87] transition-all shadow-sm">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
