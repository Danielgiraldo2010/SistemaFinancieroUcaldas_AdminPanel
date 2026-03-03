'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    category: 'Autenticación',
    icon: '🔐',
    items: [
      { name: 'Logs de Auditoría', path: '/dashboard/auth/audit-logs', icon: '📋' },
      { name: 'Configurar 2FA', path: '/dashboard/auth/2fa', icon: '🔒' },
    ],
  },
  {
    category: 'Usuarios y Roles',
    icon: '👥',
    items: [
      { name: 'Usuarios', path: '/dashboard/users', icon: '👤' },
      { name: 'Roles', path: '/dashboard/roles', icon: '🎭' },
      { name: 'Permisos', path: '/dashboard/permissions', icon: '🔑' },
    ],
  },
  {
    category: 'Seguridad',
    icon: '🛡️',
    items: [
      { name: 'IPs Bloqueadas', path: '/dashboard/security/blocked-ips', icon: '🚫' },
      { name: 'Desbloquear Cuenta', path: '/dashboard/security/unlock-account', icon: '🔓' },
    ],
  },
  {
    category: 'Mi Perfil',
    icon: '👤',
    items: [
      { name: 'Información', path: '/dashboard/profile', icon: '📝' },
      { name: 'Cambiar Contraseña', path: '/dashboard/profile/change-password', icon: '🔐' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      width: collapsed ? '80px' : '280px',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      height: '100vh',
      position: 'sticky',
      top: 0,
      transition: 'width 0.3s',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Admin Panel</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav style={{ padding: '16px 0' }}>
        {menuItems.map((section) => (
          <div key={section.category} style={{ marginBottom: '24px' }}>
            <div style={{
              padding: '8px 20px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>{section.icon}</span>
              {!collapsed && <span>{section.category}</span>}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    color: isActive ? '#667eea' : '#374151',
                    backgroundColor: isActive ? '#f5f3ff' : 'transparent',
                    borderLeft: isActive ? '3px solid #667eea' : '3px solid transparent',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
