'use client';
import { useState } from 'react';
import { securityService } from '@/lib/api/services';

export default function UnlockAccountPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await securityService.security3({ email });
      setMessage('Cuenta desbloqueada correctamente');
      setEmail('');
    } catch (error) {
      setMessage('Error al desbloquear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Desbloquear Cuenta</h1>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', maxWidth: '500px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <p style={{ marginBottom: '24px', color: '#6b7280' }}>
          Ingresa el email de la cuenta que deseas desbloquear
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Email del usuario</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
          </div>

          {message && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              borderRadius: '8px',
              backgroundColor: message.includes('Error') ? '#fee2e2' : '#f0fdf4',
              color: message.includes('Error') ? '#991b1b' : '#166534',
            }}>
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
            {loading ? 'Desbloqueando...' : 'Desbloquear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
