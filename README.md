# Admin Panel - Sistema de Administración

Panel de administración completo generado desde Swagger con Next.js 14 + TypeScript.

## 🚀 Características

### Autenticación
- ✅ Login con email/contraseña
- ✅ Autenticación de dos factores (2FA)
- ✅ Recuperación de contraseña
- ✅ Tokens JWT con refresh automático
- ✅ Logs de auditoría

### Gestión de Usuarios
- ✅ Roles y permisos
- ✅ Asignación de roles a usuarios
- ✅ Gestión de permisos por módulo

### Seguridad
- ✅ Bloqueo/desbloqueo de IPs
- ✅ Desbloqueo de cuentas
- ✅ Historial de accesos

### Perfil de Usuario
- ✅ Información personal
- ✅ Cambio de contraseña
- ✅ Configuración de 2FA

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/              # Páginas públicas (login, 2FA, etc)
│   ├── (dashboard)/         # Páginas protegidas
│   └── api/proxy/           # API Route proxy (evita CORS)
├── lib/
│   ├── api/
│   │   ├── client.ts        # Cliente HTTP con interceptors
│   │   └── services/        # Servicios auto-generados desde Swagger
│   ├── auth/
│   │   └── store.ts         # Estado global de autenticación
│   └── utils/               # Utilidades
├── components/
│   └── layout/
│       └── Sidebar.tsx      # Navegación lateral
└── types/
    └── api.types.ts         # Tipos TypeScript desde Swagger
```

## 🛠️ Instalación

```bash
npm install
npm run dev
```

## ⚙️ Configuración

Edita `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://tu-api.com
NEXT_PUBLIC_APP_NAME=Admin Panel
```

## 📋 Rutas Disponibles

### Autenticación
- `/login` - Inicio de sesión
- `/verify-2fa` - Verificación 2FA
- `/forgot-password` - Recuperar contraseña

### Dashboard
- `/dashboard` - Página principal
- `/dashboard/auth/audit-logs` - Logs de auditoría
- `/dashboard/auth/2fa` - Configurar 2FA
- `/dashboard/roles` - Gestión de roles
- `/dashboard/permissions` - Gestión de permisos
- `/dashboard/security/blocked-ips` - IPs bloqueadas
- `/dashboard/security/unlock-account` - Desbloquear cuenta
- `/dashboard/profile` - Mi perfil
- `/dashboard/profile/change-password` - Cambiar contraseña

## 🔐 Seguridad

- **Bearer Token**: Todas las peticiones incluyen token JWT automáticamente
- **Refresh Token**: Renovación automática en 401
- **Proxy API**: Evita problemas de CORS ejecutando peticiones desde el servidor
- **Cookies seguras**: Tokens almacenados con flags secure y sameSite

## 🎨 Personalización

### Colores
Edita `tailwind.config.ts`:

```typescript
colors: {
  primary: { DEFAULT: '#667eea', dark: '#5a6fd8' },
  secondary: { DEFAULT: '#764ba2' },
}
```

### Sidebar
Edita `src/components/layout/Sidebar.tsx` para agregar/modificar secciones.

## 📝 Notas

- Los servicios se generan automáticamente desde `swagger.json`
- El proxy API (`/api/proxy`) maneja todas las peticiones al backend
- El estado de autenticación se persiste en cookies
- Todos los endpoints requieren Bearer token excepto login y registro
