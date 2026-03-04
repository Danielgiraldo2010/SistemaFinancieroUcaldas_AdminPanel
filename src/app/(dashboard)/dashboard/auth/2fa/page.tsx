"use client";

import { useState } from "react";
import { authenticationService } from "@/lib/api/services";
import {
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
  Fingerprint,
  ShieldAlert,
  ToggleLeft,
  ToggleRight,
  ShieldEllipsis,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TwoFactorPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enable, setEnable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    msg: string;
  }>({
    type: null,
    msg: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      await authenticationService.authentication9({ email, password, enable });
      setStatus({
        type: "success",
        msg: `Seguridad 2FA ${enable ? "activada" : "desactivada"} exitosamente.`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        msg: "Credenciales inválidas o error de comunicación con el servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto flex flex-col items-center animate-in fade-in duration-700">
      {/* HEADER DE SECCIÓN */}
      <div className="text-center mb-10">
        <div className="bg-[#efd9af]/20 p-4 rounded-full w-fit mx-auto mb-4 border border-[#d5bb87]/30">
          <Fingerprint size={40} className="text-[#00284d]" />
        </div>
        <h1 className="text-3xl font-black text-[#00284d] tracking-tight uppercase">
          Autenticación de Doble Factor
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-2 max-w-md mx-auto">
          Añada una capa adicional de protección a su cuenta institucional
          mediante códigos de verificación únicos.
        </p>
      </div>

      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden"
        >
          {/* BANNER DE ESTADO */}
          <div
            className={`px-8 py-4 flex items-center justify-between transition-colors ${enable ? "bg-emerald-600" : "bg-slate-400"}`}
          >
            <span className="text-[10px] font-black text-white uppercase tracking-[3px]">
              Estado: {enable ? "Protección Activa" : "Protección Desactivada"}
            </span>
            <ShieldEllipsis size={20} className="text-white opacity-40" />
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                Confirmar Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-3.5 text-[#b5a27c]"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ucaldas.edu.co"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-[#d5bb87] focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-3.5 text-[#b5a27c]"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-[#d5bb87] focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            {/* TOGGLE 2FA */}
            <div
              onClick={() => setEnable(!enable)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                enable
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="flex gap-4 items-center">
                {enable ? (
                  <ShieldCheck className="text-emerald-600" />
                ) : (
                  <ShieldAlert className="text-slate-400" />
                )}
                <div>
                  <p
                    className={`text-xs font-black uppercase tracking-tight ${enable ? "text-emerald-900" : "text-slate-600"}`}
                  >
                    {enable ? "2FA Habilitado" : "Habilitar 2FA"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Requiere código en cada inicio de sesión.
                  </p>
                </div>
              </div>
              {enable ? (
                <ToggleRight size={32} className="text-emerald-600" />
              ) : (
                <ToggleLeft size={32} className="text-slate-400" />
              )}
            </div>

            <AnimatePresence mode="wait">
              {status.msg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl flex items-center gap-3 text-[11px] font-bold ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                      : "bg-rose-50 text-rose-800 border border-rose-100"
                  }`}
                >
                  {status.type === "success" ? (
                    <ShieldCheck size={16} />
                  ) : (
                    <ShieldAlert size={16} />
                  )}
                  {status.msg}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#00284d] text-[#d5bb87] rounded-2xl font-black uppercase text-[11px] tracking-[2px] shadow-xl shadow-[#00284d]/10 hover:bg-[#003e70] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Guardar Preferencias de Seguridad"
              )}
            </button>
          </form>
        </motion.div>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
          Esta configuración afecta el nivel de seguridad de su identidad
          digital <br /> en todos los módulos SAPFIAI.
        </p>
      </div>
    </div>
  );
}
