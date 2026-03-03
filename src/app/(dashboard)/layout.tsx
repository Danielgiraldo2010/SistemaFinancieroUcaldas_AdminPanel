'use client';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/lib/auth/store';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout } = useAuthStore();

  return (
    <AuthGuard>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <header style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Panel de Administración</h1>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Cerrar sesión
            </button>
          </header>
          <main style={{ padding: '24px', flex: 1 }}>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
