'use client';
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';

export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => { initialize(); }, [initialize]);
  useEffect(() => { if (!isLoading && isAuthenticated) router.replace('/dashboard'); }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) return null;
  return <>{children}</>;
}
