'use client';
import { useEffect, useState } from 'react';
import { rolesService } from '@/lib/api/services';

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await rolesService.rolesall();
      setRoles(data);
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
      await rolesService.rolespost({ name: newRole });
      setNewRole('');
      loadRoles();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (roleId: string) => {
    if (!confirm('¿Eliminar este rol?')) return;
    try {
      await rolesService.rolesdelete(roleId);
      loadRoles();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Gestión de Roles</h1>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Crear Nuevo Rol</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            required
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Nombre del rol"
            style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          />
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
            {creating ? 'Creando...' : 'Crear'}
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Nombre</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Permisos</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{role.name}</td>
                <td style={{ padding: '12px 16px' }}>{role.permissionCount || 0}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(role.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
