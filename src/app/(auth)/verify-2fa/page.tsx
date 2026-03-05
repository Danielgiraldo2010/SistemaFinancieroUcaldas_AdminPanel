"use client";

import { useState, useRef, useEffect, ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import { authenticationService } from "@/lib/api/services";
import { useAuthStore } from "@/lib/auth/store";
import Cookies from "js-cookie";

export default function Verify2FAPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const TOTAL_TIME = 120;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false); // Nuevo estado para la animación
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [expired, setExpired] = useState(false);

  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));
  const isCodeComplete = code.every((digit) => digit !== "");

  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const resetTimer = () => {
    setTimeLeft(TOTAL_TIME);
    setExpired(false);
    setError("");
    setIsError(false);
    setCode(["", "", "", "", "", ""]);
    refs[0].current?.focus();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const radius = 45;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (timeLeft / TOTAL_TIME) * circumference;

  const handleChange = (i: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    if (isError) setIsError(false); // Quitar estado de error al escribir
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = (e: ClipboardEvent) => {
    const pasteData = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, 6)
      .split("");
    if (pasteData.every((char) => /^[0-9]$/.test(char))) {
      const newCode = [...code];
      pasteData.forEach((char, index) => {
        if (index < 6) newCode[index] = char;
      });
      setCode(newCode);
      const nextFocus = pasteData.length < 6 ? pasteData.length : 5;
      refs[nextFocus].current?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0)
      refs[i - 1].current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expired || !isCodeComplete) return;

    setLoading(true);
    setError("");
    setIsError(false);

    try {
      const token = Cookies.get("temp_2fa_token");
      const response = await authenticationService.authentication3({
        code: code.join(""),
        token,
      });

      if (response.success && response.token) {
        Cookies.set("access_token", response.token, { expires: 1 });
        setUser(response.user);
        router.push("/dashboard");
      } else {
        triggerError("Código inválido");
      }
    } catch {
      triggerError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Función para activar la sacudida
  const triggerError = (msg: string) => {
    setError(msg);
    setIsError(true);
    // Quitamos el efecto después de la animación para que pueda repetirse
    setTimeout(() => setIsError(false), 500);
  };

  return (
    <>
      <style>{`
        :global(html), :global(body) {
          margin: 0; padding: 0; height: 100%; overflow: hidden; 
        }

        /* ANIMACIÓN DE SACUDIDA */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }

        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        .verify-wrapper {
          height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; position: relative;
        }

        .verify-inner {
          width: 100%; max-width: 1400px; display: flex; align-items: center; justify-content: flex-start; padding: 0 60px; z-index: 2;
        }

        .university-logo-corner {
          position: absolute; top: 30px; right: 40px; z-index: 10;
        }

        .university-logo-image {
          height: 70px; width: auto;
          filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.7));
        }

        .auth-card-mock {
          background: white; border-radius: 20px; padding: 60px 40px 40px 40px;
          width: 450px; flex: 0 0 450px; display: flex; flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); position: relative;
          transition: transform 0.3s ease;
        }

        .ci2dt-logo-internal {
          position: absolute; top: 15px; left: 20px; width: 65px; height: auto;
        }

        .otp-input {
          width: 45px; height: 55px; text-align: center; font-size: 20px; font-weight: 700;
          border-radius: 10px; border: 1.5px solid #d1d5db; outline: none; color: #003e70;
          transition: all 0.2s ease;
        }

        .otp-input:focus {
          border-color: #003e70;
          box-shadow: 0 0 0 3px rgba(0, 62, 112, 0.1);
        }

        /* Si hay error, los bordes se ponen rojos */
        .input-error {
          border-color: #ef4444 !important;
        }

        @media (max-width: 768px) {
          :global(html), :global(body) { overflow-y: auto !important; }
          .verify-wrapper { height: auto; min-height: 100vh; flex-direction: column; justify-content: flex-start; padding: 40px 20px; }
          .university-logo-corner { position: relative; top: 0; right: 0; margin-bottom: 30px; display: flex; justify-content: center; }
          .verify-inner { padding: 0; justify-content: center; width: 100%; }
          .auth-card-mock { width: 100%; max-width: 400px; flex: 1 1 auto; padding: 50px 20px 30px 20px; }
          .otp-input { width: 42px; height: 52px; }
        }
      `}</style>

      <main className="verify-wrapper">
        <div className="university-logo-corner">
          <img
            src="/images/image_2.png"
            alt="Universidad de Caldas"
            className="university-logo-image"
          />
        </div>

        <div className="verify-inner">
          {/* Se aplica la clase .shake si isError es true */}
          <div className={`auth-card-mock ${isError ? "shake" : ""}`}>
            <img
              src="/images/Logo_CIDT.png"
              alt="CI2DT"
              className="ci2dt-logo-internal"
            />

            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#003e70",
                  margin: "10px 0 5px 0",
                }}
              >
                Autenticación en Dos Pasos
              </h2>
              <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
                Ingresa el código de 6 dígitos enviado a tu correo electrónico.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <div style={{ position: "relative", display: "inline-flex" }}>
                <svg height={radius * 2} width={radius * 2}>
                  <circle
                    stroke="#f1f5f9"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                  <circle
                    stroke={expired ? "#ef4444" : "#003e70"}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + " " + circumference}
                    style={{
                      strokeDashoffset,
                      transition: "stroke-dashoffset 1s linear",
                      transform: "rotate(-90deg)",
                      transformOrigin: "50% 50%",
                    }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    strokeLinecap="round"
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                    fontWeight: 800,
                    color: expired ? "#ef4444" : "#003e70",
                  }}
                >
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={refs[i]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    className={`otp-input ${error ? "input-error" : ""}`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || expired || !isCodeComplete}
                style={{
                  width: "100%",
                  padding: "14px",
                  background:
                    loading || expired || !isCodeComplete
                      ? "#9ca3af"
                      : "#003e70",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 700,
                  transition: "all 0.3s ease",
                  cursor:
                    loading || expired || !isCodeComplete
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {loading ? "Verificando..." : "Verificar código"}
              </button>
            </form>

            <div
              style={{
                marginTop: "15px",
                textAlign: "center",
                minHeight: "24px",
              }}
            >
              {expired && (
                <button
                  type="button"
                  onClick={resetTimer}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#003e70",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Reenviar código
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
