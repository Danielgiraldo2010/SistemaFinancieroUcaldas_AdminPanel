'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/proxy/api/Authentication/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.requires2FA) {
        Cookies.set('temp_2fa_token', data.token || '', { expires: 1/24 });
        router.push('/verify-2fa');
        return;
      }

      if (data.success && data.token) {
        Cookies.set('access_token', data.token, { expires: 1 });
        if (data.refreshToken) Cookies.set('refresh_token', data.refreshToken, { expires: 30 });
        setUser(data.user);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
      padding: '44px 40px',
      width: '100%',
      maxWidth: '440px',
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>
        Iniciar sesión
      </h2>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '20px',
          color: '#dc2626',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '15px',
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '15px',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '700',
            color: 'white',
            background: loading ? '#d1d5db' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Verificando...' : 'Ingresar'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a href="/forgot-password" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </div>
  );
}
