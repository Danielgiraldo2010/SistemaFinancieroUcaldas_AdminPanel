'use client';
import { useState } from 'react';
import { authenticationService } from '@/lib/api/services';

export default function TwoFactorPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enable, setEnable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await authenticationService.authentication9({ email, password, enable });
      setMessage(`2FA ${enable ? 'habilitado' : 'deshabilitado'} correctamente`);
    } catch (error) {
      setMessage('Error al configurar 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Configurar 2FA</h1>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', maxWidth: '500px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={enable}
                onChange={(e) => setEnable(e.target.checked)}
              />
              <span>Habilitar autenticación de dos factores</span>
            </label>
          </div>

          {message && (
            <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#166534' }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Guardando...' : 'Guardar configuración'}
          </button>
        </form>
      </div>
    </div>
  );
}
