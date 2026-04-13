"use client";

import { useEffect, useState } from "react";
import { permissionsService, rolesService } from "@/services";
import { Modal } from "@/components/ui";
import { Plus, KeyRound } from "lucide-react";
import type { PermissionDto, RoleDto } from "@/core";

// Permisos completos por módulo (mock enriquecido)
const PERMISOS_MODULOS: Record<string, { key: string; label: string }[]> = {
  Presupuesto: [
    { key: "presupuesto.ver",    label: "Ver presupuesto" },
    { key: "presupuesto.crear",  label: "Crear presupuesto" },
    { key: "presupuesto.editar", label: "Editar presupuesto" },
    { key: "presupuesto.eliminar",label: "Eliminar presupuesto" },
  ],
  Ingresos: [
    { key: "ingresos.ver",    label: "Ver ingresos" },
    { key: "ingresos.crear",  label: "Crear ingreso" },
    { key: "ingresos.editar", label: "Editar ingreso" },
    { key: "ingresos.eliminar",label: "Eliminar ingreso" },
  ],
  Gastos: [
    { key: "gastos.ver",    label: "Ver gastos" },
    { key: "gastos.crear",  label: "Crear gasto" },
    { key: "gastos.editar", label: "Editar gasto" },
    { key: "gastos.eliminar",label: "Eliminar gasto" },
  ],
  Ejecución: [
    { key: "ejecucion.ver",    label: "Ver ejecución" },
    { key: "ejecucion.cdp",    label: "Gestionar CDPs" },
    { key: "ejecucion.rp",     label: "Gestionar RPs" },
    { key: "ejecucion.pagos",  label: "Registrar pagos" },
  ],
  Reportes: [
    { key: "reportes.ver",        label: "Ver reportes" },
    { key: "reportes.exportar.xls",label: "Exportar XLS" },
    { key: "reportes.exportar.pdf",label: "Exportar PDF" },
  ],
  Auditoría: [
    { key: "auditoria.ver.logs",      label: "Ver logs de acceso" },
    { key: "auditoria.ver.historial", label: "Ver historial de actividad" },
    { key: "auditoria.ver.ips",       label: "Ver IPs de usuario" },
  ],
  Administración: [
    { key: "admin.usuarios",  label: "Administrar usuarios" },
    { key: "admin.roles",     label: "Administrar roles" },
    { key: "admin.permisos",  label: "Administrar permisos" },
  ],
};

// Estado inicial de permisos por rol (mock)
const PERMISOS_POR_ROL: Record<string, Set<string>> = {
  "Admin": new Set(Object.values(PERMISOS_MODULOS).flat().map((p) => p.key)),
  "Rol Facultad": new Set([
    "presupuesto.ver","presupuesto.crear","presupuesto.editar",
    "ingresos.ver","ingresos.crear","ingresos.editar",
    "gastos.ver","gastos.crear","gastos.editar",
    "ejecucion.ver","ejecucion.cdp","ejecucion.rp",
    "reportes.ver","reportes.exportar.xls","reportes.exportar.pdf",
  ]),
  "Rol Planeación": new Set([
    "presupuesto.ver","presupuesto.crear","presupuesto.editar",
    "ingresos.ver","gastos.ver","ejecucion.ver",
    "reportes.ver","reportes.exportar.xls","reportes.exportar.pdf",
    "auditoria.ver.logs","auditoria.ver.historial",
  ]),
  "Rol Director de Programa": new Set([
    "presupuesto.ver",
    "ingresos.ver","ingresos.crear",
    "gastos.ver","gastos.crear",
    "ejecucion.ver",
    "reportes.ver",
  ]),
};

export default function AdminPermisosPage() {
  const [roles, setRoles]         = useState<RoleDto[]>([]);
  const [rolActivo, setRolActivo] = useState<string>("Admin");
  const [permsRol, setPermsRol]   = useState<Set<string>>(new Set(PERMISOS_POR_ROL["Admin"]));
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPerm, setNewPerm]     = useState({ name: "", module: "Presupuesto", description: "" });
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    rolesService.getAll().then((r) => { setRoles(r); setLoading(false); });
  }, []);

  const selectRol = (name: string) => {
    setRolActivo(name);
    setPermsRol(new Set(PERMISOS_POR_ROL[name] ?? []));
  };

  const togglePerm = (key: string) => {
    setPermsRol((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleModulo = (modulo: string) => {
    const keys = PERMISOS_MODULOS[modulo].map((p) => p.key);
    const allOn = keys.every((k) => permsRol.has(k));
    setPermsRol((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => allOn ? next.delete(k) : next.add(k));
      return next;
    });
  };

  const handleSavePerm = async () => {
    if (!newPerm.name) return;
    setSaving(true);
    await permissionsService.create({ name: newPerm.name, module: newPerm.module, description: newPerm.description });
    setSaving(false);
    setModalOpen(false);
    setNewPerm({ name: "", module: "Presupuesto", description: "" });
  };

  const totalActivos = permsRol.size;
  const totalDisp    = Object.values(PERMISOS_MODULOS).flat().length;

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo permiso"
        subtitle="Agregar permiso al catálogo del sistema"
      >
        <div className="space-y-4">
          {[
            { label: "Nombre (clave)", key: "name", placeholder: "modulo.accion" },
            { label: "Descripción",   key: "description", placeholder: "Descripción del permiso" },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
              <input
                value={(newPerm as any)[key]}
                onChange={(e) => setNewPerm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40 focus:border-[#d5bb87]"
              />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Módulo</label>
            <select
              value={newPerm.module}
              onChange={(e) => setNewPerm((f) => ({ ...f, module: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40 focus:border-[#d5bb87]"
            >
              {Object.keys(PERMISOS_MODULOS).map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSavePerm} disabled={saving || !newPerm.name} className="px-6 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003e70] transition-all disabled:opacity-50">
              {saving ? "Guardando…" : "Crear permiso"}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-[#00284d] uppercase tracking-tight">Permisos</h1>
            <p className="text-sm text-slate-500">Asignación de permisos por rol — Sistema SAPFIAI.</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00284d] text-[#d5bb87] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#003e70] transition-all shadow-md"
          >
            <Plus size={15} /> Nuevo permiso
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Permisos activos para rol", value: totalActivos, color: "text-emerald-600", border: "border-l-4 border-emerald-400" },
            { label: "Total permisos disponibles", value: totalDisp,   color: "text-[#00284d]",   border: "border-l-4 border-[#00284d]" },
            { label: "Módulos",                    value: Object.keys(PERMISOS_MODULOS).length, color: "text-slate-700", border: "border-l-4 border-[#d5bb87]" },
          ].map((m) => (
            <div key={m.label} className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 ${m.border}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{m.label}</p>
              <p className={`text-2xl font-black mt-1 ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Selector de rol */}
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Seleccionar rol</p>
            {loading
              ? [1,2,3].map((i) => <div key={i} className="h-12 bg-slate-100 rounded-2xl animate-pulse" />)
              : roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => selectRol(r.name!)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all border ${
                      rolActivo === r.name
                        ? "bg-[#00284d] text-[#d5bb87] border-[#00284d] shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <KeyRound size={14} />
                    <span className="text-xs font-black uppercase tracking-tight">{r.name}</span>
                  </button>
                ))}
          </div>

          {/* Matriz de permisos */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Permisos para: <span className="text-[#00284d]">{rolActivo}</span>
              </p>
              <span className="text-[10px] text-slate-400">{totalActivos} / {totalDisp} activos</span>
            </div>

            {Object.entries(PERMISOS_MODULOS).map(([modulo, perms]) => {
              const allOn = perms.every((p) => permsRol.has(p.key));
              const someOn = perms.some((p) => permsRol.has(p.key));
              return (
                <div key={modulo} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Header módulo */}
                  <div
                    className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => toggleModulo(modulo)}
                  >
                    <span className="text-xs font-black uppercase tracking-widest text-[#00284d]">{modulo}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{perms.filter((p) => permsRol.has(p.key)).length}/{perms.length}</span>
                      <input
                        type="checkbox"
                        checked={allOn}
                        ref={(el) => { if (el) el.indeterminate = someOn && !allOn; }}
                        onChange={() => toggleModulo(modulo)}
                        className="w-4 h-4 rounded accent-[#00284d] cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {/* Permisos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y divide-slate-50">
                    {perms.map((p) => (
                      <label key={p.key} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-slate-50/60 transition-colors">
                        <input
                          type="checkbox"
                          checked={permsRol.has(p.key)}
                          onChange={() => togglePerm(p.key)}
                          className="w-4 h-4 rounded accent-[#00284d]"
                        />
                        <span className="text-xs text-slate-600">{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Botón guardar */}
            <button
              onClick={() => alert(`Permisos guardados para ${rolActivo} (mock)`)}
              className="w-full py-3 bg-[#00284d] text-[#d5bb87] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#003e70] transition-all shadow-md"
            >
              Guardar permisos de {rolActivo}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
