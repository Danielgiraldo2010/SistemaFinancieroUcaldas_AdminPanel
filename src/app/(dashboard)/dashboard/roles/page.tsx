"use client";

import { useEffect, useState } from "react";
import { rolesService } from "@/lib/api/services";
import {
  Shield,
  Plus,
  Trash2,
  Users,
  Search,
  Loader2,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await rolesService.rolesall();
      setRoles(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim()) return;
    setCreating(true);
    try {
      await rolesService.rolespost({ name: newRole });
      setNewRole("");
      loadRoles();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (roleId: string) => {
    if (!confirm("¿Está seguro de eliminar este rol institucional?")) return;
    try {
      await rolesService.rolesdelete(roleId);
      loadRoles();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="animate-spin text-[#00284d]" size={40} />
        <p className="text-[10px] font-black text-[#b5a27c] uppercase tracking-widest text-center">
          Sincronizando Base de Datos...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* HEADER INTEGRADO */}
      <div className="mb-8 border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#00284d] tracking-tight uppercase">
            Gestión de Roles
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Administre los niveles de acceso y jerarquías del sistema SAPFIAI.
          </p>
        </div>

        {/* BUSCADOR RÁPIDO */}
        <div className="relative group w-full md:w-64">
          <Search
            size={16}
            className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-[#b5a27c] transition-colors"
          />
          <input
            type="text"
            placeholder="Buscar rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#d5bb87] focus:ring-4 focus:ring-[#d5bb87]/5 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* COLUMNA IZQUIERDA: TABLA DE ROLES (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#00284d] text-white">
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">
                    Nombre del Rol
                  </th>
                  <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest">
                    Permisos
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                  {filteredRoles.map((role) => (
                    <motion.tr
                      key={role.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#efd9af]/30 flex items-center justify-center text-[#00284d]">
                            <Shield size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                            {role.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase">
                          {role.permissionCount || 0} ASIGNADOS
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(role.id)}
                          className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Eliminar Rol"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredRoles.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  No se encontraron roles
                </p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: CREACIÓN (1/3) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-[#b5a27c] py-3 px-6">
              <h2 className="text-[10px] font-black text-white uppercase tracking-[2px] flex items-center gap-2">
                <Plus size={14} /> Nuevo Rol Institucional
              </h2>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                  Nombre Identificador
                </label>
                <input
                  required
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Ej: COORDINADOR_SISTEMAS"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#00284d] focus:bg-white transition-all placeholder:text-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3.5 rounded-xl bg-[#00284d] text-[#d5bb87] text-[11px] font-black uppercase tracking-[2px] hover:bg-[#003e70] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#00284d]/10"
              >
                {creating ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Plus size={16} /> Crear Rol
                  </>
                )}
              </button>
            </form>
          </div>

          {/* TIP INFORMATIVO */}
          <div className="p-6 bg-[#00284d]/5 border border-[#00284d]/10 rounded-2xl flex gap-4">
            <AlertCircle className="text-[#00284d] shrink-0" size={20} />
            <div className="space-y-1">
              <p className="text-[10px] font-black text-[#00284d] uppercase">
                Aviso de Jerarquía
              </p>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                Los nombres de roles deben ser únicos. Una vez creado, podrá
                asignar permisos específicos desde la sección de **Permisos**.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
