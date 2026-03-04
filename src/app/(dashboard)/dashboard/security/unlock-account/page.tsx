"use client";

import { useState } from "react";
import { securityService } from "@/lib/api/services";
import {
  UserCheck,
  Mail,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Info,
  KeyRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function UnlockAccountPage() {
  const [email, setEmail] = useState("");
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
      await securityService.security3({ email });
      setStatus({
        type: "success",
        msg: "La cuenta asociada ha sido restaurada con éxito.",
      });
      setEmail("");
    } catch (error) {
      setStatus({
        type: "error",
        msg: "No se pudo encontrar o desbloquear la cuenta solicitada.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* HEADER INTEGRADO */}
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-black text-[#00284d] tracking-tight uppercase">
          Restauración de Usuarios
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Habilite el acceso a cuentas bloqueadas por intentos fallidos o
          medidas de seguridad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* COLUMNA DEL FORMULARIO (2/3) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-[#00284d] py-3 px-6 flex items-center gap-2">
              <KeyRound size={16} className="text-[#d5bb87]" />
              <h2 className="text-[10px] font-black text-white uppercase tracking-[2px]">
                Panel de Desbloqueo Directo
              </h2>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Al ejecutar esta acción, el contador de intentos fallidos
                    del usuario se reiniciará a cero, permitiéndole intentar el
                    ingreso de nuevo inmediatamente.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-[#00284d] uppercase tracking-widest ml-1">
                      Correo Electrónico Institucional
                    </label>
                    <div className="relative group">
                      <Mail
                        size={18}
                        className="absolute left-4 top-3.5 text-[#b5a27c] group-focus-within:text-[#00284d] transition-colors"
                      />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="usuario@ucaldas.edu.co"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#d5bb87] focus:bg-white focus:ring-4 focus:ring-[#d5bb87]/5 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {status.type && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
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
                        <AlertCircle size={18} />
                      )}
                      {status.msg}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-start">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-10 py-4 rounded-xl bg-[#00284d] text-[#d5bb87] text-[11px] font-black uppercase tracking-[2px] hover:bg-[#003e70] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-[#00284d]/10"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} />
                        Desbloquear Credenciales
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* COLUMNA DE REFERENCIA (1/3) */}
        <div className="space-y-6">
          <div className="bg-[#efd9af]/10 border border-[#d5bb87]/20 p-6 rounded-2xl">
            <h3 className="text-[#00284d] font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={16} /> Ayuda al Administrador
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#b5a27c] mt-1.5 shrink-0" />
                <p className="text-[11px] text-slate-600 font-medium">
                  Verifique la identidad del solicitante antes de proceder con
                  el desbloqueo.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#b5a27c] mt-1.5 shrink-0" />
                <p className="text-[11px] text-slate-600 font-medium">
                  Si el usuario persiste con el bloqueo, sugiera un cambio de
                  contraseña.
                </p>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed text-center">
              SISTEMA DE SEGURIDAD PERIMETRAL <br /> SAPFIAI - UNIVERSIDAD DE
              CALDAS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
