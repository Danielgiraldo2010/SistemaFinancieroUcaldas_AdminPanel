'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authenticationService } from '@/lib/api/services';
import { useAuthStore } from '@/lib/auth/store';
import Cookies from 'js-cookie';

export default function Verify2FAPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handleChange = (i: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) refs[i - 1].current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Ingresa el código de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = Cookies.get('temp_2fa_token');
      const response = await authenticationService.authentication3({ code: fullCode, token });

      if (response.success && response.token) {
        Cookies.set('access_token', response.token, { expires: 1 });
        if (response.refreshToken) Cookies.set('refresh_token', response.refreshToken, { expires: 30 });
        setUser(response.user);
        router.push('/dashboard');
      } else {
        setError('Código inválido o expirado');
      }
    } catch {
      setError('Error de verificación');
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
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>🔐</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Verificación 2FA</h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Ingresa el código de 6 dígitos de tu app autenticadora
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
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
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '28px' }}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: '52px',
                height: '60px',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: '700',
                border: `2px solid ${digit ? '#667eea' : '#e5e7eb'}`,
                borderRadius: '12px',
                outline: 'none',
                backgroundColor: digit ? '#f5f3ff' : '#fafafa',
              }}
            />
          ))}
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
          {loading ? 'Verificando...' : 'Verificar código'}
        </button>
      </form>
    </div>
  );
}
