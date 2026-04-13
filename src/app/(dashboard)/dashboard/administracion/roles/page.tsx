"use client";

import { useEffect, useState } from "react";
import { rolesService, permissionsService } from "@/services";
import { Modal } from "@/components/ui";
import { Plus, Pencil, Trash2, Shield, Search } from "lucide-react";
import type { RoleDto, PermissionDto } from "@/core";

const DESCRIPCIONES: Record<string, string> = {
  "Admin":                   "Acceso total al sistema. Gestión de usuarios, roles y configuración.",
  "Rol Facultad":            "Gestión presupuestal de la facultad. Ingresos, gastos y ejecución.",
  "Rol Planeación":          "Planeación y seguimiento presupuestal institucional. Reportes y estadísticas.",
  "Rol Director de Programa":"Consulta y registro de novedades del programa académico a cargo.",
};

export default function AdminRolesPage() {
  const [roles, setRoles]           = useState<RoleDto[]>([]);
  const [permisos, setPermisos]     = useState<PermissionDto[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<RoleDto | null>(null);
  const [form, setForm]             = useState({ name: "", descripcion: "", permsSeleccionados: [] as number[] });
  const [saving, setSaving]         = useState(false);

  const load = async () => {
    setLoading(true);
    const [r, p] = await Promise.all([rolesService.getAll(), permissionsService.getAll()]);
    setRoles(r);
    setPermisos(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", descripcion: "", permsSeleccionados: [] });
    setModalOpen(true);
  };

  const openEdit = (r: RoleDto) => {
    setEditing(r);
    setForm({ name: r.name ?? "", descripcion: DESCRIPCIONES[r.name ?? ""] ?? "", permsSeleccionados: [] });
    setModalOpen(true);
  };

  const togglePerm = (id: number) =>
    setForm((f) => ({
      ...f,
      permsSeleccionados: f.permsSeleccionados.includes(id)
        ? f.permsSeleccionados.filter((p) => p !== id)
        : [...f.permsSeleccionados, id],
    }));

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    if (!editing) await rolesService.create({ name: form.name });
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (r: RoleDto) => {
    if (!confirm(`¿Eliminar el rol "${r.name}"?`)) return;
    await rolesService.delete(r.id!);
    load();
  };

  const filtered = roles.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase()),
  );

  // Agrupar permisos por módulo
  const porModulo = permisos.reduce<Record<string, PermissionDto[]>>((acc, p) => {
    const mod = p.module ?? "General";
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(p);
    return acc;
  }, {});

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar rol" : "Crear rol"}
        subtitle="Define el nombre y los permisos del rol"
      >
        <div className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre del rol</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value.toUpperCase() }))}
              placeholder="Ej: COORDINADOR_SISTEMAS"
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40 focus:border-[#d5bb87]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descripción</label>
            <textarea
              rows={2}
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40 focus:border-[#d5bb87]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Permisos</label>
            <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
              {Object.entries(porModulo).map(([mod, ps]) => (
                <div key={mod}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{mod}</p>
                  <div className="space-y-1">
                    {ps.map((p) => (
                      <label key={p.id} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.permsSeleccionados.includes(p.id!)}
                          onChange={() => togglePerm(p.id!)}
                          className="w-4 h-4 rounded accent-[#00284d]"
                        />
                        <span className="text-xs text-slate-600 group-hover:text-slate-800">{p.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.name}
              className="px-6 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003e70] transition-all disabled:opacity-50"
            >
              {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear rol"}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Roles</h1>
            <p className="text-sm text-slate-500">Niveles de acceso y jerarquías del sistema SAPFIAI.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-300" />
              <input
                type="text"
                placeholder="Buscar rol..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40 w-44"
              />
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#003e70] transition-all shadow-md"
            >
              <Plus size={15} /> Crear rol
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-[#00284d]">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Rol</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Descripción</th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest">Permisos</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? [1,2,3].map((i) => <tr key={i} className="animate-pulse"><td colSpan={4} className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-xl" /></td></tr>)
                : filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#00284d]/5 flex items-center justify-center">
                            <Shield size={15} className="text-[#00284d]" />
                          </div>
                          <span className="text-sm font-black text-[#00284d] uppercase tracking-tight">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 max-w-xs">
                        {DESCRIPCIONES[r.name ?? ""] ?? "Sin descripción"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-[#00284d]/5 text-[#00284d] rounded-lg text-[10px] font-black border border-[#00284d]/10">
                          {r.permissionCount ?? 0} permisos
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(r)} className="p-2 rounded-lg text-slate-400 hover:text-[#00284d] hover:bg-slate-100 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(r)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sin roles encontrados</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
