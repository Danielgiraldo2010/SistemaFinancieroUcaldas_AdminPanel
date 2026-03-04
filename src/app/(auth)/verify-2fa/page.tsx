"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authenticationService } from "@/lib/api/services";
import { useAuthStore } from "@/lib/auth/store";
import Cookies from "js-cookie";
import { ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export default function Verify2FAPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // SOLUCIÓN AL ERROR DE REFS: Creamos un array de refs correctamente
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Efecto para enfocar el primer input al cargar
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Solo números

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Tomar solo el último carácter
    setCode(newCode);

    // Mover al siguiente input si hay valor
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setError("Ingresa el código completo de 6 dígitos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const tempToken = Cookies.get("temp_2fa_token");
      // Ajustado a la firma del Swagger: Authentication3 (Verify2FA)
      const response = await authenticationService.authentication3({
        code: fullCode,
        token: tempToken,
      });

      if (response.success && response.token) {
        Cookies.set("access_token", response.token, { expires: 1 });
        if (response.refreshToken) {
          Cookies.set("refresh_token", response.refreshToken, { expires: 30 });
        }
        setUser(response.user);
        router.push("/dashboard");
      } else {
        setError("El código es incorrecto o ha expirado");
      }
    } catch (err) {
      setError("Error de conexión con el servidor de seguridad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl shadow-black/50 p-10 w-full max-w-[440px] border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl mb-4">
            <ShieldCheck className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Verificación de Seguridad
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Ingresa el código de 6 dígitos generado por tu aplicación móvil.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex gap-2 justify-center">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={cn(
                  "w-12 h-16 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all",
                  digit
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-400",
                )}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2",
              loading
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-[0.98]",
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verificando...
              </>
            ) : (
              "Confirmar Identidad"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
