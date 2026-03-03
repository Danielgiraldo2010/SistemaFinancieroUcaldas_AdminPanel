'use client';
import { useEffect, useState } from 'react';
import { securityService } from '@/lib/api/services';

export default function BlockedIpsPage() {
  const [ips, setIps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ipAddress: '', reason: '', notes: '' });
  const [blocking, setBlocking] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadIps();
  }, []);

  const loadIps = async () => {
    try {
      const data = await securityService.securityall({ activeOnly: true });
      setIps(data);
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response?.status === 403) {
        setMessage('No tienes permisos para ver las IPs bloqueadas');
      } else {
        setMessage('Error al cargar las IPs bloqueadas');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlocking(true);
    try {
      await securityService.security({ ...form, blackListReason: 0 });
      setForm({ ipAddress: '', reason: '', notes: '' });
      loadIps();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setBlocking(false);
    }
  };

  const handleUnblock = async (ipAddress: string) => {
    if (!confirm('¿Desbloquear esta IP?')) return;
    try {
      await securityService.security2({ ipAddress });
      loadIps();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  if (message && ips.length === 0) {
    return (
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>IPs Bloqueadas</h1>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b', marginBottom: '16px' }}>
            {message}
          </div>
          <p style={{ color: '#6b7280' }}>Contacta al administrador para obtener los permisos necesarios.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>IPs Bloqueadas</h1>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Bloquear Nueva IP</h2>
        <form onSubmit={handleBlock}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Dirección IP</label>
              <input
                type="text"
                required
                value={form.ipAddress}
                onChange={(e) => setForm({ ...form, ipAddress: e.target.value })}
                placeholder="192.168.1.1"
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Razón</label>
              <input
                type="text"
                required
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Notas</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', minHeight: '60px' }}
            />
          </div>
          <button
            type="submit"
            disabled={blocking}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: blocking ? 'not-allowed' : 'pointer',
            }}
          >
            {blocking ? 'Bloqueando...' : 'Bloquear IP'}
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>IP</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Razón</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Fecha</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ips.map((ip) => (
              <tr key={ip.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{ip.ipAddress}</td>
                <td style={{ padding: '12px 16px' }}>{ip.reason}</td>
                <td style={{ padding: '12px 16px' }}>{new Date(ip.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleUnblock(ip.ipAddress)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#d1fae5',
                      color: '#065f46',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Desbloquear
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
