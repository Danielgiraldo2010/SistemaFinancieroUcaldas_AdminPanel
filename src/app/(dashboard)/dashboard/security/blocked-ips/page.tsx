"use client";

import { useEffect, useState } from "react";
import { securityService } from "@/lib/api/services";
import {
  ShieldAlert,
  ShieldCheck,
  Globe,
  FileText,
  Search,
  Loader2,
  History,
  Ban,
  Unlock,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function BlockedIpsPage() {
  const [ips, setIps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ipAddress: "", reason: "", notes: "" });
  const [blocking, setBlocking] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadIps();
  }, []);

  const loadIps = async () => {
    try {
      const data = await securityService.securityall({ activeOnly: true });
      setIps(data);
    } catch (error: any) {
      console.error("Error:", error);
      if (error.response?.status === 403) {
        setMessage("Acceso denegado: No posee privilegios de Auditor de Red.");
      } else {
        setMessage("Error de conexión con el servicio de seguridad.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlocking(true);
    try {
      await securityService.security({ ...form, blackListReason: 0 });
      setForm({ ipAddress: "", reason: "", notes: "" });
      loadIps();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setBlocking(false);
    }
  };

  const handleUnblock = async (ipAddress: string) => {
    if (
      !confirm(
        `¿Confirmar levantamiento de restricción para la IP ${ipAddress}?`,
      )
    )
      return;
    try {
      await securityService.security2({ ipAddress });
      loadIps();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredIps = ips.filter(
    (ip) =>
      ip.ipAddress.includes(searchTerm) ||
      ip.reason.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#00284d] mb-4" size={40} />
        <span className="text-[10px] font-black text-[#b5a27c] uppercase tracking-[3px]">
          Escaneando Firewall...
        </span>
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* HEADER TÉCNICO */}
      <div className="mb-8 border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-2xl font-black text-[#00284d] tracking-tight uppercase">
              Control de Lista Negra (IP)
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Gestión de perímetros y bloqueos de red institucional.
          </p>
        </div>

        <div className="relative group w-full md:w-72">
          <Search
            size={16}
            className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#00284d] transition-colors"
          />
          <input
            type="text"
            placeholder="Filtrar por IP o Razón..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#00284d] transition-all"
          />
        </div>
      </div>

      {message && ips.length === 0 ? (
        <div className="bg-rose-50 border border-rose-100 p-10 rounded-[2rem] text-center max-w-2xl mx-auto">
          <ShieldAlert className="text-rose-500 mx-auto mb-4" size={48} />
          <h2 className="text-rose-900 font-black uppercase tracking-tight mb-2">
            Restricción de Perfil
          </h2>
          <p className="text-rose-700 text-sm font-medium mb-6">{message}</p>
          <div className="h-px bg-rose-200 w-24 mx-auto mb-6" />
          <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest leading-relaxed">
            Solicite el rol de "Administrador de Seguridad" <br /> para
            gestionar el filtrado de red.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* TABLA DE IPs (2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[#00284d] border-b border-slate-100">
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">
                        Dirección IP
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">
                        Motivo de Bloqueo
                      </th>
                      <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest">
                        Fecha Registro
                      </th>
                      <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence>
                      {filteredIps.map((ip) => (
                        <motion.tr
                          key={ip.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Globe size={14} className="text-[#b5a27c]" />
                              <span className="text-xs font-mono font-black text-slate-700">
                                {ip.ipAddress}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold text-slate-500 tracking-tight">
                              {ip.reason}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">
                              <History size={12} />
                              {new Date(ip.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleUnblock(ip.ipAddress)}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-100 transition-all flex items-center gap-2 ml-auto border border-emerald-100"
                            >
                              <Unlock size={14} /> Desbloquear
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              {filteredIps.length === 0 && (
                <div className="p-20 text-center space-y-2">
                  <ShieldCheck className="text-emerald-400 mx-auto" size={40} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
                    Perímetro Limpio - Sin Amenazas Activas
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FORMULARIO DE BLOQUEO (1/3) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border-2 border-rose-50 shadow-xl shadow-rose-900/5 overflow-hidden">
              <div className="bg-rose-600 py-3 px-6 flex items-center gap-2">
                <Ban size={16} className="text-white" />
                <h2 className="text-[10px] font-black text-white uppercase tracking-[2px]">
                  Acción de Bloqueo
                </h2>
              </div>

              <form onSubmit={handleBlock} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                    Dirección IPv4/v6
                  </label>
                  <input
                    required
                    type="text"
                    value={form.ipAddress}
                    onChange={(e) =>
                      setForm({ ...form, ipAddress: e.target.value })
                    }
                    placeholder="0.0.0.0"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono font-bold focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                    Razón Técnica
                  </label>
                  <input
                    required
                    type="text"
                    value={form.reason}
                    onChange={(e) =>
                      setForm({ ...form, reason: e.target.value })
                    }
                    placeholder="Ej: Ataque Fuerza Bruta"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold focus:outline-none focus:border-[#00284d] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1 flex items-center gap-1">
                    <FileText size={12} /> Notas de Auditoría
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium focus:outline-none min-h-[80px] resize-none"
                    placeholder="Detalles adicionales..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={blocking}
                  className="w-full py-4 rounded-xl bg-rose-600 text-white text-[11px] font-black uppercase tracking-[2px] hover:bg-rose-700 transition-all disabled:opacity-50 shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
                >
                  {blocking ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Ejecutar Bloqueo Inmediato"
                  )}
                </button>
              </form>
            </div>

            <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
              <AlertTriangle className="text-amber-600 shrink-0" size={20} />
              <div className="space-y-1">
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-tighter">
                  Protocolo de Seguridad
                </p>
                <p className="text-[11px] text-amber-700/80 font-medium leading-relaxed">
                  Todo bloqueo de IP queda registrado con su usuario y marca de
                  tiempo para auditorías externas de la Universidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
