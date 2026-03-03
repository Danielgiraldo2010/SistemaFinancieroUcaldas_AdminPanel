'use client';
import { useAuthStore } from '@/lib/auth/store';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Mi Perfil</h1>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', maxWidth: '600px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#667eea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white',
            marginBottom: '16px',
          }}>
            👤
          </div>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
              Email
            </label>
            <div style={{ padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              {user?.email || 'No disponible'}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
              Nombre de usuario
            </label>
            <div style={{ padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              {user?.userName || 'No disponible'}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
              Teléfono
            </label>
            <div style={{ padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              {user?.phoneNumber || 'No disponible'}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
              2FA Habilitado
            </label>
            <div style={{ padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              {user?.twoFactorEnabled ? '✅ Sí' : '❌ No'}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
              Último acceso
            </label>
            <div style={{ padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              {user?.lastLoginDate ? new Date(user.lastLoginDate).toLocaleString() : 'No disponible'}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
              IP del último acceso
            </label>
            <div style={{ padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px', fontFamily: 'monospace' }}>
              {user?.lastLoginIp || 'No disponible'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
