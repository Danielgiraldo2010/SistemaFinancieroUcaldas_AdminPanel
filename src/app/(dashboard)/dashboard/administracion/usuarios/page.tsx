"use client";

import { useEffect, useState } from "react";
import {
  getMockAdminUsers, createMockAdminUser,
  updateMockAdminUser, softDeleteMockAdminUser,
  type AdminUserDto,
} from "@/lib/dashboard-mocks";
import { Modal } from "@/components/ui";
import {
  UserPlus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Search, UserCircle2, Mail, Phone, Shield,
} from "lucide-react";

const ROLES = ["Admin", "Rol Facultad", "Rol Planeación", "Rol Director de Programa"];

const emptyForm = {
  userName: "", email: "", phoneNumber: "" as string | null,
  rol: ROLES[1], estado: "Activo" as "Activo" | "Inactivo",
};

export default function AdminUsuariosPage() {
  const [users, setUsers]         = useState<AdminUserDto[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<AdminUserDto | null>(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);

  const load = async () => {
    setLoading(true);
    setUsers(await getMockAdminUsers());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (u: AdminUserDto) => {
    setEditing(u);
    setForm({ userName: u.userName, email: u.email, phoneNumber: u.phoneNumber, rol: u.rol, estado: u.estado });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.userName || !form.email) return;
    setSaving(true);
    if (editing) {
      await updateMockAdminUser(editing.id, form);
    } else {
      await createMockAdminUser(form);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleToggle = async (u: AdminUserDto) => {
    await updateMockAdminUser(u.id, { estado: u.estado === "Activo" ? "Inactivo" : "Activo" });
    load();
  };

  const handleDelete = async (u: AdminUserDto) => {
    if (!confirm(`¿Desactivar a ${u.userName}? El usuario no será eliminado del sistema.`)) return;
    await softDeleteMockAdminUser(u.id);
    load();
  };

  const handleRolChange = async (u: AdminUserDto, rol: string) => {
    await updateMockAdminUser(u.id, { rol });
    load();
  };

  const filtered = users.filter(
    (u) =>
      u.userName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar usuario" : "Nuevo usuario"}
        subtitle={editing ? `Modificando: ${editing.email}` : "Registrar nuevo usuario institucional"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Nombre completo", key: "userName", type: "text",  icon: UserCircle2, placeholder: "Ej: Carlos Mejía" },
              { label: "Correo institucional", key: "email", type: "email", icon: Mail, placeholder: "usuario@ucaldas.edu.co" },
              { label: "Teléfono (opcional)", key: "phoneNumber", type: "tel", icon: Phone, placeholder: "+57 300 000 0000" },
            ].map(({ label, key, type, icon: Icon, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
                <div className="relative">
                  <Icon size={14} className="absolute left-3 top-3 text-slate-300" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={(form as any)[key] ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value || null }))}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40 focus:border-[#d5bb87]"
                  />
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rol</label>
              <div className="relative">
                <Shield size={14} className="absolute left-3 top-3 text-slate-300" />
                <select
                  value={form.rol}
                  onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40 focus:border-[#d5bb87] appearance-none"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</label>
            <button
              onClick={() => setForm((f) => ({ ...f, estado: f.estado === "Activo" ? "Inactivo" : "Activo" }))}
              className={`px-3 py-1 rounded-lg text-[10px] font-black border transition-colors ${form.estado === "Activo" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}
            >
              {form.estado}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.userName || !form.email}
              className="px-6 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003e70] transition-all disabled:opacity-50"
            >
              {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear usuario"}
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Usuarios</h1>
            <p className="text-sm text-slate-500">Gestión de usuarios institucionales del sistema SAPFIAI.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-300" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40 w-52"
              />
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#003e70] transition-all shadow-md"
            >
              <UserPlus size={15} /> Nuevo usuario
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total usuarios",  value: users.length,                                    color: "text-[#00284d]",   border: "border-l-4 border-[#00284d]" },
            { label: "Activos",         value: users.filter((u) => u.estado === "Activo").length,  color: "text-emerald-600", border: "border-l-4 border-emerald-400" },
            { label: "Inactivos",       value: users.filter((u) => u.estado === "Inactivo").length,color: "text-rose-600",    border: "border-l-4 border-rose-400" },
            { label: "Roles distintos", value: new Set(users.map((u) => u.rol)).size,            color: "text-slate-700",   border: "border-l-4 border-[#d5bb87]" },
          ].map((m) => (
            <div key={m.label} className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 ${m.border}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{m.label}</p>
              <p className={`text-2xl font-black mt-1 ${m.color}`}>{loading ? "—" : m.value}</p>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-[#00284d]">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Usuario</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Rol</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Creado</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Último acceso</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? [1,2,3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-xl" /></td>
                    </tr>
                  ))
                : filtered.map((u) => (
                    <tr key={u.id} className={`hover:bg-slate-50/60 transition-colors ${u.estado === "Inactivo" ? "opacity-60" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#00284d] flex items-center justify-center text-[#d5bb87] text-xs font-black shrink-0">
                            {u.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{u.userName}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={u.rol}
                          onChange={(e) => handleRolChange(u, e.target.value)}
                          className="text-xs font-bold text-[#00284d] bg-[#00284d]/5 border border-[#00284d]/10 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40 cursor-pointer"
                        >
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${u.estado === "Activo" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                          {u.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">{u.createdAt}</td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">{u.lastLogin ?? "—"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(u)} title="Editar" className="p-2 rounded-lg text-slate-400 hover:text-[#00284d] hover:bg-slate-100 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleToggle(u)} title={u.estado === "Activo" ? "Desactivar" : "Activar"} className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                            {u.estado === "Activo" ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} />}
                          </button>
                          <button onClick={() => handleDelete(u)} title="Eliminar (soft)" className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
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
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sin resultados</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
