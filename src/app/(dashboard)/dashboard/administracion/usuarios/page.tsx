"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui";
import { getRoleDisplayName, normalizeRoleName } from "@/lib";
import { rolesService, usersService } from "@/services";
import type { AdminIdentityUserDto } from "@/services";
import type { RoleDto } from "@/core";
import {
  Eye,
  EyeOff,
  Pencil,
  UserPlus,
  Trash2,
  Search,
  UserCircle2,
  Mail,
  Shield,
  KeyRound,
} from "lucide-react";

const REQUIRED_ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "FACULTAD", label: "Rol Facultad" },
  { value: "PLANEACION", label: "Rol Planeacion" },
  { value: "DIRECTOR_DE_PROGRAMA", label: "Rol Director de Programa" },
] as const;

const REQUIRED_ROLE_NAMES = REQUIRED_ROLE_OPTIONS.map((role) => role.value);

type RoleOption = {
  value: string;
  label: string;
};

type UserFormState = {
  fullName: string;
  email: string;
  password: string;
  roleName: string;
};

const emptyForm: UserFormState = {
  fullName: "",
  email: "",
  password: "",
  roleName: "FACULTAD",
};

const fieldConfigs: Array<{
  label: string;
  key: keyof UserFormState;
  type: string;
  icon: typeof UserCircle2;
  placeholder: string;
}> = [
  {
    label: "Nombre completo",
    key: "fullName",
    type: "text",
    icon: UserCircle2,
    placeholder: "Ej: Carlos Mejia",
  },
  {
    label: "Correo institucional",
    key: "email",
    type: "email",
    icon: Mail,
    placeholder: "usuario@ucaldas.edu.co",
  },
  {
    label: "Contraseña temporal",
    key: "password",
    type: "password",
    icon: KeyRound,
    placeholder: "Minimo 8 caracteres",
  },
];

function getRoleLabel(roleName: string | null): string {
  return getRoleDisplayName(roleName);
}

function buildRoleOptions(roles: RoleDto[]): RoleOption[] {
  const knownByNormalized = new Map(
    roles.map((role) => [
      (role.normalizedName ?? role.name?.toUpperCase() ?? ""),
      role.name ?? "",
    ]),
  );

  return REQUIRED_ROLE_OPTIONS.map((role) => ({
    value: knownByNormalized.get(role.value) ?? role.value,
    label: role.label,
  }));
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<AdminIdentityUserDto[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminIdentityUserDto | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const ensuredRoles = await rolesService.ensureRequiredRoles(REQUIRED_ROLE_NAMES);
      const [userList] = await Promise.all([usersService.getAll()]);

      setRoles(buildRoleOptions(ensuredRoles));
      setUsers(userList);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No fue posible cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setShowPassword(false);
    setModalOpen(true);
  };

  const openEdit = (user: AdminIdentityUserDto) => {
    setEditingUser(user);
    setForm({
      fullName: user.userName,
      email: user.email,
      password: "",
      roleName: normalizeRoleName(user.rol) ?? "FACULTAD",
    });
    setShowPassword(false);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.fullName || !form.email || !form.roleName) return;
    if (!editingUser && !form.password) return;

    setSaving(true);
    setError(null);

    try {
      if (editingUser) {
        await usersService.updateRole({
          userId: editingUser.id,
          email: editingUser.email,
          fullName: form.fullName.trim(),
          roleName: form.roleName,
        });
      } else {
        await usersService.create({
          email: form.email.trim(),
          password: form.password,
          fullName: form.fullName.trim(),
          roleName: form.roleName,
        });
      }

      setModalOpen(false);
      setEditingUser(null);
      setForm(emptyForm);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No fue posible crear el usuario.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: AdminIdentityUserDto) => {
    if (!confirm(`¿Eliminar a ${user.userName} de la base de datos? Esta accion no se puede deshacer.`)) return;

    try {
      await usersService.delete(user.id);
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "No fue posible eliminar el usuario.");
    }
  };

  const filtered = users.filter(
    (user) =>
      user.userName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const usersWithVisibleRole = users.filter((user) => !!user.rol).length;

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? "Modificar usuario" : "Nuevo usuario"}
        subtitle={
          editingUser
            ? "Actualizar rol visible del usuario seleccionado"
            : "Registrar usuario real en la base y asignarle un rol institucional"
        }
      >
        <div className="tour-usuarios-form space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fieldConfigs
              .filter(({ key }) => !editingUser || key !== "password")
              .map(({ label, key, type, icon: Icon, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
                <div className="relative">
                  <Icon size={14} className="absolute left-3 top-3 text-slate-300" />
                  <input
                    type={key === "password" && showPassword ? "text" : type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, [key]: event.target.value }))
                    }
                    disabled={editingUser !== null && key !== "password"}
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40 focus:border-[#d5bb87]"
                  />
                  {key === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-[#00284d] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rol</label>
              <div className="relative">
                <Shield size={14} className="absolute left-3 top-3 text-slate-300" />
                <select
                  value={form.roleName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, roleName: event.target.value }))
                  }
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40 focus:border-[#d5bb87] appearance-none"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {editingUser
              ? "Desde aqui puedes ajustar el rol que usa el sistema para permisos y visualizacion."
              : "Esta pantalla crea el usuario directamente en la base y luego asigna el rol seleccionado."}
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.fullName || !form.email || (!editingUser && !form.password)}
              className="tour-usuarios-guardar px-6 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003e70] transition-all disabled:opacity-50"
            >
              {saving ? "Guardando..." : editingUser ? "Modificar usuario" : "Crear usuario"}
            </button>
            <button
              onClick={() => {
                setModalOpen(false);
                setEditingUser(null);
              }}
              className="tour-usuarios-cancelar px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Usuarios</h1>
            <p className="text-sm text-slate-500">Listado real de usuarios del sistema con alta y eliminacion en base de datos.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-300" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40 w-52"
              />
            </div>
            <button
              onClick={openCreate}
              className="tour-usuarios-nuevo flex items-center gap-2 px-5 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#003e70] transition-all shadow-md"
            >
              <UserPlus size={15} /> Nuevo usuario
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total usuarios", value: users.length, color: "text-[#00284d]", border: "border-l-4 border-[#00284d]" },
            { label: "Correos confirmados", value: users.filter((user) => user.emailConfirmed).length, color: "text-emerald-600", border: "border-l-4 border-emerald-400" },
            { label: "Roles visibles", value: usersWithVisibleRole, color: "text-slate-700", border: "border-l-4 border-[#d5bb87]" },
            { label: "Roles base", value: roles.length, color: "text-[#003e70]", border: "border-l-4 border-[#003e70]" },
          ].map((metric) => (
            <div key={metric.label} className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 ${metric.border}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{metric.label}</p>
              <p className={`text-2xl font-black mt-1 ${metric.color}`}>{loading ? "—" : metric.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-[#00284d]">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Usuario</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Rol</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Creado</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Ultimo acceso</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? [1, 2, 3].map((item) => (
                    <tr key={item} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="h-8 bg-slate-100 rounded-xl" />
                      </td>
                    </tr>
                  ))
                : filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#00284d] flex items-center justify-center text-[#d5bb87] text-xs font-black shrink-0">
                            {user.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{user.userName}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-lg border border-[#00284d]/10 bg-[#00284d]/5 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#00284d]">
                          {getRoleLabel(user.rol)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg text-[10px] font-black border bg-emerald-50 text-emerald-700 border-emerald-100">
                          {user.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">{user.createdAt}</td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">{user.lastLogin ?? "—"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(user)}
                            title="Modificar usuario"
                            className="p-2 rounded-lg text-slate-400 hover:text-[#00284d] hover:bg-slate-100 transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            title="Eliminar usuario"
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
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
