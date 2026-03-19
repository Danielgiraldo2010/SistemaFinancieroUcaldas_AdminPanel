'use client';
import { ReactNode } from 'react';

// MOCK MODE: guard desactivado temporalmente mientras el backend está en mantenimiento
export function AuthGuard({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
