'use client';
import { useState } from 'react';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.newPassword !== form.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Aquí iría la llamada al endpoint de cambio de contraseña
      // await authService.changePassword(form);
      setMessage('Contraseña actualizada correctamente');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage('Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Cambiar Contraseña</h1>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', maxWidth: '500px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Contraseña actual</label>
            <input
              type="password"
              required
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Nueva contraseña</label>
            <input
              type="password"
              required
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Confirmar nueva contraseña</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
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
            {loading ? 'Actualizando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
