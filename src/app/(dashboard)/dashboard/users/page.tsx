"use client";

import { useState } from "react";
import { authenticationService } from "@/lib/api/services";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  AlertCircle,
  X,
  Loader2,
  ChevronDown,
  UserCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
    phoneNumber: "",
  });
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    msg: string;
  }>({ type: null, msg: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setStatus({
        type: "error",
        msg: "Las contraseñas ingresadas no coinciden.",
      });
      return;
    }
    setCreating(true);
    setStatus({ type: null, msg: "" });
    try {
      await authenticationService.authentication(form);
      setStatus({
        type: "success",
        msg: "Registro completado. El usuario ya puede acceder al sistema.",
      });
      setForm({
        email: "",
        password: "",
        confirmPassword: "",
        userName: "",
        phoneNumber: "",
      });
      setTimeout(() => setShowForm(false), 2000);
    } catch (error) {
      setStatus({
        type: "error",
        msg: "Hubo un problema al registrar el usuario. Verifique los datos.",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-700">
      {/* CABECERA DE PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#00284d] tracking-tight uppercase">
            Gestión de Usuarios
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Administración de credenciales y perfiles de acceso institucional.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg ${
            showForm
              ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
              : "bg-[#00284d] text-[#d5bb87] hover:bg-[#003e70] shadow-[#00284d]/10"
          }`}
        >
          {showForm ? <X size={16} /> : <UserPlus size={16} />}
          {showForm ? "Cerrar Formulario" : "Nuevo Usuario"}
        </button>
      </div>

      <AnimatePresence>
        {status.msg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-rose-50 text-rose-700 border-rose-100"
            }`}
          >
            {status.type === "success" ? (
              <ShieldCheck size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {status.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORMULARIO ANIMADO */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden mb-12"
          >
            <div className="bg-[#b5a27c] px-8 py-4 flex justify-between items-center text-white">
              <span className="text-[10px] font-black uppercase tracking-[3px]">
                Formulario de Alta
              </span>
              <UserCircle2 size={20} className="opacity-50" />
            </div>

            <form onSubmit={handleCreate} className="p-8 md:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative group">
                    <Mail
                      size={18}
                      className="absolute left-4 top-3.5 text-[#b5a27c] group-focus-within:text-[#00284d] transition-colors"
                    />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="ejemplo@ucaldas.edu.co"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-[#d5bb87] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                    Nombre de Usuario
                  </label>
                  <div className="relative group">
                    <User
                      size={18}
                      className="absolute left-4 top-3.5 text-[#b5a27c] group-focus-within:text-[#00284d] transition-colors"
                    />
                    <input
                      type="text"
                      value={form.userName}
                      onChange={(e) =>
                        setForm({ ...form, userName: e.target.value })
                      }
                      placeholder="Nombre completo o ID"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-[#d5bb87] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                    Contraseña *
                  </label>
                  <div className="relative group">
                    <Lock
                      size={18}
                      className="absolute left-4 top-3.5 text-[#b5a27c] group-focus-within:text-[#00284d] transition-colors"
                    />
                    <input
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-[#00284d] transition-all"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative group">
                    <Lock
                      size={18}
                      className="absolute left-4 top-3.5 text-[#b5a27c] group-focus-within:text-[#00284d] transition-colors"
                    />
                    <input
                      type="password"
                      required
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-[#00284d] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                  Teléfono de Contacto
                </label>
                <div className="relative group max-w-md">
                  <Phone
                    size={18}
                    className="absolute left-4 top-3.5 text-[#b5a27c] group-focus-within:text-[#00284d] transition-colors"
                  />
                  <input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.target.value })
                    }
                    placeholder="+57 300 000 0000"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-[#d5bb87] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                  * Campos obligatorios para el registro en SAPFIAI
                </p>
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full md:w-auto px-12 py-4 bg-[#00284d] text-[#d5bb87] rounded-2xl font-black uppercase text-[11px] tracking-[2px] shadow-xl shadow-[#00284d]/20 hover:bg-[#003e70] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                >
                  {creating ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Finalizar Registro de Usuario"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER / PLACEHOLDER PARA LISTADO */}
      {!showForm && (
        <div className="py-20 text-center space-y-4 border-2 border-dashed border-slate-100 rounded-[3rem]">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <UserCircle2 size={32} />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[3px]">
            Seleccione "Nuevo Usuario" para comenzar
          </p>
        </div>
      )}
    </div>
  );
}
