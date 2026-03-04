"use client";

import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    msg: string;
  }>({
    type: null,
    msg: "",
  });

  const passwordStrength =
    form.newPassword.length === 0
      ? ""
      : form.newPassword.length < 6
        ? "débil"
        : form.newPassword.length < 10
          ? "medium"
          : "strong";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: "error", msg: "Las nuevas contraseñas no coinciden." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus({
        type: "success",
        msg: "Tu contraseña ha sido actualizada con éxito.",
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setStatus({ type: "error", msg: "Error al actualizar la contraseña." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl animate-in fade-in duration-500">
      {/* HEADER INTEGRADO AL DASHBOARD */}
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-black text-[#00284d] tracking-tight uppercase">
          Configuración de Seguridad
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Gestione las credenciales de acceso de su cuenta SAPFIAI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* COLUMNA PRINCIPAL: FORMULARIO (2/3) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-[#00284d] py-3 px-6">
              <h2 className="text-[10px] font-black text-[#d5bb87] uppercase tracking-[2px]">
                Formulario de Actualización
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Contraseña Actual */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-3.5 text-[#b5a27c]"
                  />
                  <input
                    required
                    type={show.current ? "text" : "password"}
                    value={form.currentPassword}
                    onChange={(e) =>
                      setForm({ ...form, currentPassword: e.target.value })
                    }
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#d5bb87] focus:bg-white transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, current: !show.current })}
                    className="absolute right-4 top-3 text-slate-400 hover:text-[#00284d]"
                  >
                    {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full" />

              {/* Nueva y Confirmación en Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={show.new ? "text" : "password"}
                      value={form.newPassword}
                      onChange={(e) =>
                        setForm({ ...form, newPassword: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#d5bb87] focus:bg-white transition-all"
                      placeholder="Nueva clave"
                    />
                    <button
                      type="button"
                      onClick={() => setShow({ ...show, new: !show.new })}
                      className="absolute right-4 top-3 text-slate-400"
                    >
                      {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                    Confirmar Nueva
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={show.confirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#d5bb87] focus:bg-white transition-all"
                      placeholder="Repita clave"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShow({ ...show, confirm: !show.confirm })
                      }
                      className="absolute right-4 top-3 text-slate-400"
                    >
                      {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Fortaleza de Contraseña */}
              {form.newPassword && (
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          passwordStrength === "strong"
                            ? "100%"
                            : passwordStrength === "medium"
                              ? "66%"
                              : "33%",
                        backgroundColor:
                          passwordStrength === "strong"
                            ? "#10b981"
                            : passwordStrength === "medium"
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                      className="h-full"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Seguridad:{" "}
                    <span className="text-slate-700">{passwordStrength}</span>
                  </p>
                </div>
              )}

              {/* Mensajes de Estado */}
              <AnimatePresence mode="wait">
                {status.type && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "p-4 rounded-xl flex items-center gap-3 text-xs font-bold border",
                      status.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                        : "bg-rose-50 text-rose-800 border-rose-100",
                    )}
                  >
                    {status.type === "success" ? (
                      <ShieldCheck size={18} />
                    ) : (
                      <ShieldAlert size={18} />
                    )}
                    {status.msg}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-10 py-3.5 rounded-xl bg-[#00284d] text-[#d5bb87] text-[11px] font-black uppercase tracking-[2px] hover:bg-[#003e70] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-[#00284d]/10"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Guardar Nueva Contraseña"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* COLUMNA LATERAL: INFORMACIÓN (1/3) */}
        <div className="space-y-6">
          <div className="bg-[#efd9af]/10 border border-[#d5bb87]/20 p-6 rounded-2xl">
            <div className="flex items-center gap-2 text-[#00284d] mb-4">
              <Info size={18} />
              <h3 className="text-xs font-black uppercase tracking-wider">
                Recomendaciones
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                { t: "Longitud", d: "Mínimo 8-10 caracteres." },
                {
                  t: "Complejidad",
                  d: "Combine mayúsculas, números y símbolos.",
                },
                {
                  t: "Seguridad",
                  d: "No utilice contraseñas de otros sitios.",
                },
              ].map((item, i) => (
                <li key={i} className="space-y-1">
                  <p className="text-[10px] font-black text-[#b5a27c] uppercase">
                    {item.t}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">{item.d}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight">
              Su contraseña protege su identidad digital en la plataforma.
              Cámbiela al menos cada 90 días.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
