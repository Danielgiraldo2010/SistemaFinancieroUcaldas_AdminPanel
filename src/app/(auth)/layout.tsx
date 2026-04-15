"use client";

import { ReactNode } from "react";
import { GuestGuard } from "@/guards";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <GuestGuard>
      <>{children}</>
    </GuestGuard>
  );
}
