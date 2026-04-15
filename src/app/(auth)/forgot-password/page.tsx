"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { authService } from "@/services";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      setSent(true);
    } catch {
      setError("No fue posible enviar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <style jsx>{`
        @keyframes slowZoom {
          0% {
            transform: scale(1) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.035) translate3d(-0.8%, -0.5%, 0);
          }
          100% {
            transform: scale(1.07) translate3d(0.8%, 0.6%, 0);
          }
        }
      `}</style>

      <div className="absolute inset-0">
        <Image
          src="/images/Fondo_UCaldas.jpeg"
          alt="Fondo Universidad de Caldas"
          fill
          priority
          className="object-cover"
          style={{
            animation: "slowZoom 28s ease-in-out infinite alternate",
            willChange: "transform",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-[#003366]/45" />

      <div className="relative z-10 flex h-full w-full flex-col lg:flex-row-reverse">
        <section className="flex h-[40%] w-full items-center justify-center px-6 py-8 lg:h-full lg:w-[50%] lg:px-12">
          <div className="flex items-center gap-8 lg:-translate-x-12 xl:-translate-x-16">
            <div
              style={{
                filter:
                  "drop-shadow(0 0 18px rgba(255,255,255,0.85)) brightness(0) saturate(100%) invert(100%)",
              }}
            >
              <Image
                src="/images/logo-cidtt.png"
                alt="Logo CIDTT"
                width={180}
                height={84}
                priority
                className="h-auto w-[100px] sm:w-[130px] xl:w-[180px]"
              />
            </div>
            <div
              style={{
                filter:
                  "drop-shadow(0 0 18px rgba(255,255,255,0.85)) brightness(0) saturate(100%) invert(100%)",
              }}
            >
              <Image
                src="/images/Logo_UCaldas.png"
                alt="Logo Universidad de Caldas"
                width={360}
                height={130}
                priority
                className="h-auto w-[220px] sm:w-[280px] xl:w-[360px]"
              />
            </div>
          </div>
        </section>

        <section className="flex h-[60%] w-full items-center justify-center px-5 pb-8 sm:px-8 lg:h-full lg:w-[50%]">
          <div className="w-full max-w-[400px] rounded-[2rem] bg-white/95 px-7 py-12 shadow-2xl backdrop-blur-xl sm:px-8 sm:py-12">
            {sent ? (
              <div className="space-y-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#003366]/10 text-[#003366]">
                  <MailCheck size={30} />
                </div>
                <h1 className="text-3xl font-bold text-[#003366]">
                  Correo enviado
                </h1>
                <p className="text-sm text-slate-600">
                  Si el correo existe en el sistema, recibiras instrucciones
                  para recuperar tu contrasena.
                </p>
                <Link
                  href="/login"
                  className="inline-flex rounded-xl bg-[#003366] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Volver al login
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-bold text-[#003366]">
                    Recuperar acceso
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Ingresa tu correo institucional para enviarte instrucciones.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-center text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Correo Institucional
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trim())}
                      placeholder="usuario@ucaldas.edu.co"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[#003366] py-3 text-base font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Enviando..." : "Enviar instrucciones"}
                  </button>
                </form>

                <div className="mt-5 text-right">
                  <Link
                    href="/login"
                    className="text-xs font-medium text-[#003366] transition hover:underline"
                  >
                    Volver al login
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
