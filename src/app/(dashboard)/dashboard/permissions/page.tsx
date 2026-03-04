"use client";

import { useEffect, useState } from "react";
import { permissionsService } from "@/lib/api/services";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldPlus,
  Search,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Tag,
  Filter,
  FileText,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", module: "" });
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const data = await permissionsService.permissionsall({
        activeOnly: false,
      });
      setPermissions(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await permissionsService.permissionspost(form);
      setForm({ name: "", description: "", module: "" });
      loadPermissions();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCreating(false);
    }
  };

  const filteredPermissions = permissions.filter(
    (perm) =>
      perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.module.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER INSTITUCIONAL */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#00284d] tracking-tight uppercase">
            Gestión de Permisos
          </h1>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
            <Lock size={14} className="text-[#b5a27c]" />
            Control de acceso granular por módulos funcionales del SAPFIAI.
          </p>
        </div>

        {/* BUSCADOR AVANZADO */}
        <div className="relative group w-full md:w-80">
          <Search
            size={18}
            className="absolute left-4 top-3 text-slate-400 group-focus-within:text-[#00284d] transition-colors"
          />
          <input
            type="text"
            placeholder="Buscar por nombre o módulo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#d5bb87]/5 focus:border-[#d5bb87] transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: REGISTRO (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 sticky top-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[#00284d] rounded-2xl shadow-lg shadow-[#00284d]/20">
                <ShieldPlus size={24} className="text-[#d5bb87]" />
              </div>
              <h2 className="font-black text-[#00284d] uppercase text-[10px] tracking-[2px]">
                Nuevo Descriptor de Acceso
              </h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nombre Técnico
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: finanzas.leer.reportes"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#00284d] transition-all outline-none text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Módulo del Sistema
                </label>
                <div className="relative">
                  <Tag
                    size={16}
                    className="absolute left-4 top-4 text-[#b5a27c]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Ej: Contabilidad"
                    value={form.module}
                    onChange={(e) =>
                      setForm({ ...form, module: e.target.value })
                    }
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#00284d] transition-all outline-none text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Propósito del Permiso
                </label>
                <textarea
                  placeholder="Describa la acción que habilita este permiso..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#00284d] transition-all outline-none text-xs font-medium min-h-[120px] resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-4 bg-[#00284d] text-[#d5bb87] rounded-2xl font-black uppercase text-[11px] tracking-[2px] shadow-lg shadow-[#00284d]/10 hover:bg-[#003e70] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              >
                {creating ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Registrar Permiso Institucional"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: LISTADO (2/3) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Registros Encontrados: {filteredPermissions.length}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[#00284d] border-b border-slate-50 text-left">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[2px]">
                      Descriptor
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[2px]">
                      Módulo
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[2px]">
                      Descripción
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-[2px]">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    [1, 2, 3, 4, 5, 6].map((i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-8 py-6">
                          <div className="h-8 bg-slate-100 rounded-xl w-full" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <AnimatePresence>
                      {filteredPermissions.map((perm) => (
                        <motion.tr
                          key={perm.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-slate-50/80 transition-all group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#b5a27c]" />
                              <span className="text-xs font-mono font-black text-slate-700 tracking-tighter">
                                {perm.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-slate-100 text-[#00284d] rounded-lg text-[10px] font-black uppercase border border-slate-200/50">
                              {perm.module}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[240px] line-clamp-2 italic">
                              {perm.description || "Sin descripción registrada"}
                            </p>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <div
                              className={cn(
                                "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                perm.isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-rose-50 text-rose-700 border border-rose-100",
                              )}
                            >
                              {perm.isActive ? (
                                <ShieldCheck size={12} />
                              ) : (
                                <ShieldAlert size={12} />
                              )}
                              {perm.isActive ? "Autorizado" : "Restringido"}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>

            {!loading && filteredPermissions.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                  <FileText size={48} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  No se han encontrado criterios coincidentes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
