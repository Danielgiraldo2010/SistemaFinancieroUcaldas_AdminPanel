"use client";

import { ReactNode } from "react";
import { GuestGuard } from "@/components/guards/GuestGuard";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <GuestGuard>
      {/* Cambiamos minHeight por height: 100vh y usamos overflow: hidden 
          para que nada (especialmente la animación) se salga de los bordes.
      */}
      <div
        style={{
          height: "100vh",
          width: "100vw",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <style>{`
          @keyframes strongZoom {
            from { transform: scale(1); }
            to { transform: scale(1.1); }
          }
          
          /* Forzamos que el html y body no tengan scroll mientras este layout esté activo */
          :global(html), :global(body) {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden !important;
          }
        `}</style>

        {/* IMAGEN DE FONDO */}
        <div
          style={{
            position: "absolute", // Absolute respecto al padre que tiene overflow hidden
            inset: 0,
            backgroundColor: "#0f172a",
            backgroundImage: "url('/images/Fondo_UCaldas.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: "strongZoom 20s ease-in-out infinite alternate",
            zIndex: 0,
            pointerEvents: "none", // Para que no interfiera con clicks
          }}
        />

        {/* CAPA AZUL CRISTALINA */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 86, 179, 0.32)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* CONTENIDO */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%", // Ocupa el 100% del padre (100vh)
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}
