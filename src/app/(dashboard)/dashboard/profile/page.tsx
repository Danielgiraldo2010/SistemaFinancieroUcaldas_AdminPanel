"use client";
import { useAuthStore } from "@/lib/auth/store";
import { useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Monitor,
  Fingerprint,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user } = useAuthStore();

  const infoFields = [
    { label: "Email Institucional", value: user?.email, icon: Mail },
    {
      label: "Nombre de Usuario",
      value: user?.userName || user?.name,
      icon: User,
    },
    {
      label: "Teléfono / Contacto",
      value: user?.phoneNumber || user?.phone,
      icon: Phone,
    },
    {
      label: "Estado de Seguridad 2FA",
      value: user?.twoFactorEnabled ? "Habilitado" : "No Habilitado",
      icon: Fingerprint,
      isBadge: true,
    },
    {
      label: "Última Sesión",
      value: user?.lastLoginDate
        ? new Date(user.lastLoginDate).toLocaleString()
        : null,
      icon: Calendar,
    },
    {
      label: "Dirección IP de Acceso",
      value: user?.lastLoginIp,
      icon: Monitor,
      isMono: true,
    },
  ];

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* TÍTULO DINÁMICO */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-[#00284d] tracking-tight uppercase">
          Mi Perfil
        </h1>
        <p className="text-gray-500 text-sm">
          Información personal y detalles de seguridad de tu cuenta SAPFIAI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* COLUMNA IZQUIERDA: AVATAR Y ACCIONES */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-[#00284d] flex items-center justify-center text-white text-4xl font-black border-4 border-[#efd9af] shadow-xl transition-transform group-hover:scale-105">
                {user?.userName?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-black text-[#00284d] uppercase tracking-tight">
                {user?.userName || "Administrador"}
              </h2>
              <span className="text-[10px] font-bold text-[#b5a27c] bg-[#efd9af]/30 px-3 py-1 rounded-full uppercase tracking-widest">
                Personal Administrativo
              </span>
            </div>

            <button className="mt-8 w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              <ExternalLink size={14} />
              Editar Datos
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: INFORMACIÓN DETALLADA */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-[11px] font-black text-[#00284d] uppercase tracking-[3px]">
                Detalles de la Cuenta
              </h3>
            </div>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {infoFields.map((field, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <field.icon size={14} className="opacity-70" />
                    <label className="text-[10px] font-black uppercase tracking-wider">
                      {field.label}
                    </label>
                  </div>

                  {field.isBadge ? (
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold ${
                        user?.twoFactorEnabled
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}
                    >
                      <ShieldCheck size={12} />
                      {field.value}
                    </div>
                  ) : (
                    <p
                      className={`text-sm font-bold text-[#00284d] tracking-tight ${field.isMono ? "font-mono bg-gray-50 px-2 py-1 rounded w-fit" : ""}`}
                    >
                      {field.value || "No disponible"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#00284d]/5 border border-[#00284d]/10 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-[#00284d] text-[#d5bb87] rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#00284d] uppercase tracking-wide">
                Privacidad y Seguridad
              </h4>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                Esta cuenta está protegida por los protocolos de seguridad de la
                Universidad de Caldas. Si notas actividad inusual, contacta a
                soporte técnico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
