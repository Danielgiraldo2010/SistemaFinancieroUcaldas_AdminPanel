'use client';
import { useEffect, useState } from 'react';
import { permissionsService } from '@/lib/api/services';

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', module: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const data = await permissionsService.permissionsall({ activeOnly: false });
      setPermissions(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await permissionsService.permissionspost(form);
      setForm({ name: '', description: '', module: '' });
      loadPermissions();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Gestión de Permisos</h1>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Crear Nuevo Permiso</h2>
        <form onSubmit={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Nombre</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Módulo</label>
              <input
                type="text"
                required
                value={form.module}
                onChange={(e) => setForm({ ...form, module: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', minHeight: '80px' }}
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            style={{
              padding: '10px 20px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: creating ? 'not-allowed' : 'pointer',
            }}
          >
            {creating ? 'Creando...' : 'Crear Permiso'}
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Nombre</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Módulo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Descripción</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm) => (
              <tr key={perm.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{perm.name}</td>
                <td style={{ padding: '12px 16px' }}>{perm.module}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{perm.description}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: perm.isActive ? '#d1fae5' : '#fee2e2',
                    color: perm.isActive ? '#065f46' : '#991b1b',
                  }}>
                    {perm.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
