'use client';
import { useState } from 'react';
import { authenticationService } from '@/lib/api/services';

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', userName: '', phoneNumber: '' });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    setCreating(true);
    setMessage('');
    try {
      await authenticationService.authentication(form);
      setMessage('Usuario creado correctamente');
      setForm({ email: '', password: '', confirmPassword: '', userName: '', phoneNumber: '' });
      setShowForm(false);
    } catch (error) {
      setMessage('Error al crear usuario');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Gestión de Usuarios</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {message && (
        <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '8px', backgroundColor: message.includes('Error') ? '#fee2e2' : '#f0fdf4', color: message.includes('Error') ? '#991b1b' : '#166534' }}>
          {message}
        </div>
      )}

      {showForm && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Crear Nuevo Usuario</h2>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Email *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Nombre de usuario</label>
                <input type="text" value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Contraseña *</label>
                <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Confirmar Contraseña *</label>
                <input type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Teléfono</label>
              <input type="tel" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            </div>
            <button type="submit" disabled={creating} style={{ padding: '10px 20px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: creating ? 'not-allowed' : 'pointer' }}>
              {creating ? 'Creando...' : 'Crear Usuario'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
