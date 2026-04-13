import type {
  AuditLogDto,
  BlockIpCommand,
  IpBlackListDto,
  PermissionDto,
  RegisterCommand,
  RegisterResponse,
  RoleDto,
  UnblockIpCommand,
  UnlockAccountCommand,
  VigenciaDto,
  UnidadEjecutoraDto,
  FuenteFinanciacionDto,
  CentroCostoDto,
  RubroPresupuestalDto,
  ProyectoDto,
  PresupuestoDto,
  ModificacionPresupuestalDto,
  CdpDto,
  RpDto,
  ObligacionDto,
  PagoDto,
  EjecucionPresupuestalDto,
} from "@/core";

const now = new Date();
const wait = async () => new Promise((resolve) => setTimeout(resolve, 150));

// ─── Auth / Seguridad ─────────────────────────────────────────────────────────

let mockAuditLogs: AuditLogDto[] = [
  { id: 1, userEmail: "tesoreria@ucaldas.edu.co",  action: "Login exitoso",                      ipAddress: "192.168.10.24", timestamp: now.toISOString(),                                        status: "Success" },
  { id: 2, userEmail: "presupuesto@ucaldas.edu.co", action: "Exportación PDF",                   ipAddress: "192.168.10.31", timestamp: new Date(now.getTime() - 1000 * 60 * 43).toISOString(),  status: "Success" },
  { id: 3, userEmail: "auditoria@ucaldas.edu.co",  action: "Consulta de historial de actividad", ipAddress: "10.0.1.18",     timestamp: new Date(now.getTime() - 1000 * 60 * 95).toISOString(),  status: "Success" },
];

let mockRoles: RoleDto[] = [
  { id: "role-1", name: "Admin",                  permissionCount: 28 },
  { id: "role-2", name: "Rol Facultad",            permissionCount: 18 },
  { id: "role-3", name: "Rol Planeación",          permissionCount: 14 },
  { id: "role-4", name: "Rol Director de Programa",permissionCount: 10 },
];

let mockPermissions: PermissionDto[] = [
  { id: 1, name: "presupuesto.leer.ingresos", module: "Presupuesto", description: "Permite consultar ingresos institucionales.",          isActive: true, createdAt: now.toISOString() },
  { id: 2, name: "informes.exportar.pdf",     module: "Informes",    description: "Habilita exportaciones PDF desde reportes financieros.", isActive: true, createdAt: now.toISOString() },
  { id: 3, name: "auditoria.ver.logs",        module: "Auditoría",   description: "Permite consultar logs operativos y de acceso.",        isActive: true, createdAt: now.toISOString() },
];

let mockBlockedIps: IpBlackListDto[] = [
  { id: 1, ipAddress: "181.57.22.14",   reason: "Intentos repetidos de autenticación",       isActive: true, createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 6).toISOString() },
  { id: 2, ipAddress: "190.90.17.221",  reason: "Actividad sospechosa detectada por firewall", isActive: true, createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 14).toISOString() },
];

let mockRegisteredUsers = [
  { id: "user-1", email: "admin.finanzas@ucaldas.edu.co", userName: "Administrador Finanzas" },
];

export async function getMockAuditLogs() { await wait(); return [...mockAuditLogs]; }

export async function createMockUser(data: RegisterCommand): Promise<RegisterResponse> {
  await wait();
  const userId = `user-${mockRegisteredUsers.length + 1}`;
  mockRegisteredUsers = [{ id: userId, email: data.email || `usuario${userId}@ucaldas.edu.co`, userName: data.userName || "Usuario Institucional" }, ...mockRegisteredUsers];
  mockAuditLogs = [{ id: mockAuditLogs.length + 1, userEmail: data.email || null, action: "Registro de usuario", ipAddress: "127.0.0.1", timestamp: new Date().toISOString(), status: "Success" }, ...mockAuditLogs];
  return { success: true, userId, message: "Usuario registrado en modo mock." };
}

export async function updateMockTwoFactor(email: string, enable: boolean) {
  await wait();
  mockAuditLogs = [{ id: mockAuditLogs.length + 1, userEmail: email, action: enable ? "2FA habilitado" : "2FA deshabilitado", ipAddress: "127.0.0.1", timestamp: new Date().toISOString(), status: "Success" }, ...mockAuditLogs];
}

export async function getMockRoles() { await wait(); return [...mockRoles]; }

export async function createMockRole(name?: string) {
  await wait();
  const nextRole: RoleDto = { id: `role-${mockRoles.length + 1}`, name: (name || "NUEVO_ROL").toUpperCase(), permissionCount: 0 };
  mockRoles = [nextRole, ...mockRoles];
  return nextRole;
}

export async function deleteMockRole(roleId: string) { await wait(); mockRoles = mockRoles.filter((r) => r.id !== roleId); }
export async function getMockPermissions() { await wait(); return [...mockPermissions]; }

export async function createMockPermission(data: { name?: string; description?: string | null; module?: string }) {
  await wait();
  const next: PermissionDto = { id: mockPermissions.length + 1, name: data.name || "nuevo.permiso", description: data.description || "Permiso generado en modo mock.", module: data.module || "General", isActive: true, createdAt: new Date().toISOString() };
  mockPermissions = [next, ...mockPermissions];
  return next;
}

export async function getMockBlockedIps() { await wait(); return [...mockBlockedIps]; }

export async function createMockBlockedIp(data: BlockIpCommand) {
  await wait();
  mockBlockedIps = [{ id: mockBlockedIps.length + 1, ipAddress: data.ipAddress || "0.0.0.0", reason: data.reason || "Bloqueo manual", isActive: true, createdAt: new Date().toISOString() }, ...mockBlockedIps];
}

export async function removeMockBlockedIp(data: UnblockIpCommand) { await wait(); mockBlockedIps = mockBlockedIps.filter((i) => i.ipAddress !== data.ipAddress); }

export async function unlockMockAccount(data: UnlockAccountCommand) {
  await wait();
  mockAuditLogs = [{ id: mockAuditLogs.length + 1, userEmail: data.userId || null, action: "Desbloqueo de cuenta", ipAddress: "127.0.0.1", timestamp: new Date().toISOString(), status: "Success" }, ...mockAuditLogs];
}

// ─── MOCKS ADMINISTRACIÓN ────────────────────────────────────────────────────

export interface AdminUserDto {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  rol: string;
  estado: "Activo" | "Inactivo";
  createdAt: string;
  lastLogin: string | null;
}

export let mockAdminUsers: AdminUserDto[] = [
  { id: "u-001", userName: "Carlos Mejía",       email: "carlos.mejia@ucaldas.edu.co",    phoneNumber: "3001234567", rol: "Admin",                  estado: "Activo",   createdAt: "2024-01-15", lastLogin: "2025-03-31 08:12" },
  { id: "u-002", userName: "Ana Torres",          email: "ana.torres@ucaldas.edu.co",      phoneNumber: "3109876543", rol: "Rol Facultad",           estado: "Activo",   createdAt: "2024-02-20", lastLogin: "2025-03-31 07:55" },
  { id: "u-003", userName: "Luis Ríos",           email: "luis.rios@ucaldas.edu.co",       phoneNumber: null,         rol: "Rol Planeación",         estado: "Activo",   createdAt: "2024-03-10", lastLogin: "2025-03-30 17:40" },
  { id: "u-004", userName: "María Gómez",         email: "maria.gomez@ucaldas.edu.co",     phoneNumber: "3154445566", rol: "Rol Director de Programa",estado: "Inactivo", createdAt: "2024-04-05", lastLogin: "2025-03-28 14:22" },
  { id: "u-005", userName: "Jorge Salcedo",       email: "jorge.salcedo@ucaldas.edu.co",   phoneNumber: "3207778899", rol: "Rol Facultad",           estado: "Activo",   createdAt: "2024-05-18", lastLogin: "2025-03-29 09:10" },
  { id: "u-006", userName: "Patricia Londoño",    email: "patricia.londono@ucaldas.edu.co",phoneNumber: null,         rol: "Rol Planeación",         estado: "Activo",   createdAt: "2024-06-22", lastLogin: "2025-03-31 10:05" },
];

export async function getMockAdminUsers() { await wait(); return [...mockAdminUsers]; }

export async function createMockAdminUser(data: Omit<AdminUserDto, "id" | "createdAt" | "lastLogin">) {
  await wait();
  const nuevo: AdminUserDto = {
    ...data,
    id: `u-${String(mockAdminUsers.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString().split("T")[0],
    lastLogin: null,
  };
  mockAdminUsers = [nuevo, ...mockAdminUsers];
  return nuevo;
}

export async function updateMockAdminUser(id: string, data: Partial<AdminUserDto>) {
  await wait();
  mockAdminUsers = mockAdminUsers.map((u) => (u.id === id ? { ...u, ...data } : u));
}

export async function softDeleteMockAdminUser(id: string) {
  await wait();
  mockAdminUsers = mockAdminUsers.map((u) => (u.id === id ? { ...u, estado: "Inactivo" } : u));
}

// ─── MOCKS PRESUPUESTALES (basados en el ER del sistema) ─────────────────────

export const mockVigencias: VigenciaDto[] = [
  { id_vigencia: 1, anio: 2025, fecha_inicio: "2025-01-01", fecha_fin: "2025-12-31", estado: "Abierta" },
  { id_vigencia: 2, anio: 2024, fecha_inicio: "2024-01-01", fecha_fin: "2024-12-31", estado: "Cerrada" },
];

export const mockUnidades: UnidadEjecutoraDto[] = [
  { id_unidad: 1, codigo: "FAC-ING", nombre: "Facultad de Ingeniería" },
  { id_unidad: 2, codigo: "FAC-CIE", nombre: "Facultad de Ciencias Exactas" },
  { id_unidad: 3, codigo: "VIC-ACA", nombre: "Vicerrectoría Académica" },
  { id_unidad: 4, codigo: "DIR-TI",  nombre: "Dirección de TI" },
  { id_unidad: 5, codigo: "BIB-CEN", nombre: "Biblioteca Central" },
];

export const mockFuentes: FuenteFinanciacionDto[] = [
  { id_fuente: 1, codigo: "NAC", nombre: "Transferencias Nación" },
  { id_fuente: 2, codigo: "PRO", nombre: "Recursos Propios" },
  { id_fuente: 3, codigo: "EST", nombre: "Estampilla Pro-Universidad" },
  { id_fuente: 4, codigo: "CON", nombre: "Convenios" },
];

export const mockCentrosCosto: CentroCostoDto[] = [
  { id_centro: 1, codigo: "CC-001", nombre: "Rectoría",          id_tipo: 1, tipo_nombre: "Administrativo" },
  { id_centro: 2, codigo: "CC-002", nombre: "Ing. de Sistemas",  id_tipo: 2, tipo_nombre: "Académico" },
  { id_centro: 3, codigo: "CC-003", nombre: "Bienestar Univ.",   id_tipo: 3, tipo_nombre: "Bienestar" },
  { id_centro: 4, codigo: "CC-004", nombre: "Investigación",     id_tipo: 4, tipo_nombre: "Investigación" },
];

export const mockRubros: RubroPresupuestalDto[] = [
  { id_rubro: 1, codigo_catalogo: "2.1", nombre: "Servicios Personales Asociados a la Nómina", tipo: "Gasto",         id_unidad: 3, unidad_nombre: "Vicerrectoría Académica" },
  { id_rubro: 2, codigo_catalogo: "2.2", nombre: "Servicios Personales Indirectos",            tipo: "Gasto",         id_unidad: 3, unidad_nombre: "Vicerrectoría Académica" },
  { id_rubro: 3, codigo_catalogo: "2.3", nombre: "Gastos Generales",                           tipo: "Gasto",         id_unidad: 1, unidad_nombre: "Facultad de Ingeniería" },
  { id_rubro: 4, codigo_catalogo: "3.1", nombre: "Adquisición de Equipos TI",                  tipo: "Inversión",     id_unidad: 4, unidad_nombre: "Dirección de TI" },
  { id_rubro: 5, codigo_catalogo: "1.1", nombre: "Matrículas Pregrado",                        tipo: "Ingreso",       id_unidad: 3, unidad_nombre: "Vicerrectoría Académica" },
  { id_rubro: 6, codigo_catalogo: "1.2", nombre: "Matrículas Posgrado",                        tipo: "Ingreso",       id_unidad: 3, unidad_nombre: "Vicerrectoría Académica" },
  { id_rubro: 7, codigo_catalogo: "2.4", nombre: "Transferencias Bienestar",                   tipo: "Transferencia", id_unidad: 3, unidad_nombre: "Vicerrectoría Académica" },
];

export const mockProyectos: ProyectoDto[] = [
  { id_proyecto: 1, codigo: "PRY-001", nombre: "Modernización Infraestructura TI",    descripcion: "Renovación de servidores y red institucional." },
  { id_proyecto: 2, codigo: "PRY-002", nombre: "Programa Bienestar Estudiantil 2025", descripcion: "Actividades culturales, deportivas y psicosociales." },
  { id_proyecto: 3, codigo: "PRY-003", nombre: "Investigación Aplicada Facultades",   descripcion: "Financiación de proyectos de investigación." },
];

export let mockPresupuestos: PresupuestoDto[] = [
  { id_presupuesto: 1, id_vigencia: 1, anio: 2025, id_rubro: 1, rubro_nombre: "Servicios Personales Nómina",  rubro_tipo: "Gasto",         id_fuente: 1, fuente_nombre: "Transferencias Nación",     id_centro: 1, centro_nombre: "Rectoría",        id_proyecto: null, proyecto_nombre: null,                              apropiacion_inicial: 11700000000, presupuesto_vigente: 11700000000 },
  { id_presupuesto: 2, id_vigencia: 1, anio: 2025, id_rubro: 2, rubro_nombre: "Servicios Personales Indir.",  rubro_tipo: "Gasto",         id_fuente: 2, fuente_nombre: "Recursos Propios",          id_centro: 2, centro_nombre: "Ing. de Sistemas", id_proyecto: 3,    proyecto_nombre: "Investigación Aplicada",          apropiacion_inicial:  1200000000, presupuesto_vigente:  1350000000 },
  { id_presupuesto: 3, id_vigencia: 1, anio: 2025, id_rubro: 3, rubro_nombre: "Gastos Generales",             rubro_tipo: "Gasto",         id_fuente: 2, fuente_nombre: "Recursos Propios",          id_centro: 1, centro_nombre: "Rectoría",        id_proyecto: null, proyecto_nombre: null,                              apropiacion_inicial:  1070000000, presupuesto_vigente:  1020000000 },
  { id_presupuesto: 4, id_vigencia: 1, anio: 2025, id_rubro: 4, rubro_nombre: "Adquisición Equipos TI",       rubro_tipo: "Inversión",     id_fuente: 3, fuente_nombre: "Estampilla Pro-Universidad", id_centro: 4, centro_nombre: "Investigación",   id_proyecto: 1,    proyecto_nombre: "Modernización Infraestructura TI", apropiacion_inicial:   900000000, presupuesto_vigente:   900000000 },
  { id_presupuesto: 5, id_vigencia: 1, anio: 2025, id_rubro: 5, rubro_nombre: "Matrículas Pregrado",          rubro_tipo: "Ingreso",       id_fuente: 2, fuente_nombre: "Recursos Propios",          id_centro: 1, centro_nombre: "Rectoría",        id_proyecto: null, proyecto_nombre: null,                              apropiacion_inicial:  4200000000, presupuesto_vigente:  4200000000 },
  { id_presupuesto: 6, id_vigencia: 1, anio: 2025, id_rubro: 6, rubro_nombre: "Matrículas Posgrado",          rubro_tipo: "Ingreso",       id_fuente: 2, fuente_nombre: "Recursos Propios",          id_centro: 1, centro_nombre: "Rectoría",        id_proyecto: null, proyecto_nombre: null,                              apropiacion_inicial:  1800000000, presupuesto_vigente:  1800000000 },
  { id_presupuesto: 7, id_vigencia: 1, anio: 2025, id_rubro: 7, rubro_nombre: "Transferencias Bienestar",     rubro_tipo: "Transferencia", id_fuente: 1, fuente_nombre: "Transferencias Nación",     id_centro: 3, centro_nombre: "Bienestar Univ.", id_proyecto: 2,    proyecto_nombre: "Programa Bienestar Estudiantil",  apropiacion_inicial:   280000000, presupuesto_vigente:   280000000 },
];

export let mockModificaciones: ModificacionPresupuestalDto[] = [
  { id_modificacion: 1, id_presupuesto: 2, rubro_nombre: "Servicios Personales Indir.", tipo: "Adición",   valor: 150000000, fecha: "2025-02-10" },
  { id_modificacion: 2, id_presupuesto: 3, rubro_nombre: "Gastos Generales",            tipo: "Reducción", valor:  50000000, fecha: "2025-02-28" },
  { id_modificacion: 3, id_presupuesto: 4, rubro_nombre: "Adquisición Equipos TI",      tipo: "Traslado",  valor: 100000000, fecha: "2025-03-05" },
];

export let mockCdps: CdpDto[] = [
  { id_cdp: 1, id_presupuesto: 3, rubro_nombre: "Gastos Generales",            numero: "CDP-2025-001", valor:  85000000, fecha: "2025-01-15", estado: "Comprometido" },
  { id_cdp: 2, id_presupuesto: 4, rubro_nombre: "Adquisición Equipos TI",      numero: "CDP-2025-002", valor: 420000000, fecha: "2025-01-20", estado: "Comprometido" },
  { id_cdp: 3, id_presupuesto: 2, rubro_nombre: "Servicios Personales Indir.", numero: "CDP-2025-003", valor:  28000000, fecha: "2025-02-03", estado: "Vigente"      },
  { id_cdp: 4, id_presupuesto: 7, rubro_nombre: "Transferencias Bienestar",    numero: "CDP-2025-004", valor:  12000000, fecha: "2025-02-10", estado: "Comprometido" },
  { id_cdp: 5, id_presupuesto: 3, rubro_nombre: "Gastos Generales",            numero: "CDP-2025-005", valor:  35000000, fecha: "2025-03-01", estado: "Vigente"      },
];

export let mockRps: RpDto[] = [
  { id_rp: 1, id_cdp: 1, cdp_numero: "CDP-2025-001", numero: "RP-2025-001", valor:  85000000, fecha: "2025-01-22", estado: "Obligado" },
  { id_rp: 2, id_cdp: 2, cdp_numero: "CDP-2025-002", numero: "RP-2025-002", valor: 420000000, fecha: "2025-01-28", estado: "Obligado" },
  { id_rp: 3, id_cdp: 4, cdp_numero: "CDP-2025-004", numero: "RP-2025-003", valor:  12000000, fecha: "2025-02-15", estado: "Activo"   },
];

export let mockObligaciones: ObligacionDto[] = [
  { id_obligacion: 1, id_rp: 1, rp_numero: "RP-2025-001", numero: "OBL-2025-001", valor:  85000000, fecha: "2025-02-05", estado: "Pagada"    },
  { id_obligacion: 2, id_rp: 2, rp_numero: "RP-2025-002", numero: "OBL-2025-002", valor: 420000000, fecha: "2025-02-10", estado: "Pendiente" },
];

export let mockPagos: PagoDto[] = [
  { id_pago: 1, id_obligacion: 1, obligacion_numero: "OBL-2025-001", numero: "PAGO-2025-001", valor: 85000000, fecha: "2025-02-20" },
];

export const mockEjecucion: EjecucionPresupuestalDto[] = [
  { id_presupuesto: 1, rubro_nombre: "Servicios Personales Nómina",  rubro_tipo: "Gasto",         fuente_nombre: "Transferencias Nación",     centro_nombre: "Rectoría",        apropiacion_inicial: 11700000000, presupuesto_vigente: 11700000000, comprometido: 11700000000, obligado: 11300000000, pagado: 11300000000, disponible:          0 },
  { id_presupuesto: 2, rubro_nombre: "Servicios Personales Indir.",  rubro_tipo: "Gasto",         fuente_nombre: "Recursos Propios",          centro_nombre: "Ing. de Sistemas", apropiacion_inicial:  1200000000, presupuesto_vigente:  1350000000, comprometido:    28000000, obligado:         0, pagado:         0, disponible:  1322000000 },
  { id_presupuesto: 3, rubro_nombre: "Gastos Generales",             rubro_tipo: "Gasto",         fuente_nombre: "Recursos Propios",          centro_nombre: "Rectoría",        apropiacion_inicial:  1070000000, presupuesto_vigente:  1020000000, comprometido:   120000000, obligado:  85000000, pagado:  85000000, disponible:   900000000 },
  { id_presupuesto: 4, rubro_nombre: "Adquisición Equipos TI",       rubro_tipo: "Inversión",     fuente_nombre: "Estampilla Pro-Universidad", centro_nombre: "Investigación",   apropiacion_inicial:   900000000, presupuesto_vigente:   900000000, comprometido:   420000000, obligado: 420000000, pagado:         0, disponible:   480000000 },
  { id_presupuesto: 5, rubro_nombre: "Matrículas Pregrado",          rubro_tipo: "Ingreso",       fuente_nombre: "Recursos Propios",          centro_nombre: "Rectoría",        apropiacion_inicial:  4200000000, presupuesto_vigente:  4200000000, comprometido:          0, obligado:         0, pagado: 3980000000, disponible:  4200000000 },
  { id_presupuesto: 6, rubro_nombre: "Matrículas Posgrado",          rubro_tipo: "Ingreso",       fuente_nombre: "Recursos Propios",          centro_nombre: "Rectoría",        apropiacion_inicial:  1800000000, presupuesto_vigente:  1800000000, comprometido:          0, obligado:         0, pagado: 1750000000, disponible:  1800000000 },
  { id_presupuesto: 7, rubro_nombre: "Transferencias Bienestar",     rubro_tipo: "Transferencia", fuente_nombre: "Transferencias Nación",     centro_nombre: "Bienestar Univ.", apropiacion_inicial:   280000000, presupuesto_vigente:   280000000, comprometido:    12000000, obligado:  12000000, pagado:         0, disponible:   268000000 },
];

// ─── Funciones de acceso presupuestal ────────────────────────────────────────

export async function getMockVigencias() { await wait(); return [...mockVigencias]; }
export async function getMockUnidades()  { await wait(); return [...mockUnidades]; }
export async function getMockFuentes()   { await wait(); return [...mockFuentes]; }
export async function getMockCentros()   { await wait(); return [...mockCentrosCosto]; }
export async function getMockRubros()    { await wait(); return [...mockRubros]; }
export async function getMockProyectos() { await wait(); return [...mockProyectos]; }

export async function getMockPresupuestos(id_vigencia?: number) {
  await wait();
  return id_vigencia ? mockPresupuestos.filter((p) => p.id_vigencia === id_vigencia) : [...mockPresupuestos];
}

export async function getMockModificaciones(id_presupuesto?: number) {
  await wait();
  return id_presupuesto ? mockModificaciones.filter((m) => m.id_presupuesto === id_presupuesto) : [...mockModificaciones];
}

export async function getMockCdps(id_presupuesto?: number) {
  await wait();
  return id_presupuesto ? mockCdps.filter((c) => c.id_presupuesto === id_presupuesto) : [...mockCdps];
}

export async function getMockRps(id_cdp?: number) {
  await wait();
  return id_cdp ? mockRps.filter((r) => r.id_cdp === id_cdp) : [...mockRps];
}

export async function getMockObligaciones(id_rp?: number) {
  await wait();
  return id_rp ? mockObligaciones.filter((o) => o.id_rp === id_rp) : [...mockObligaciones];
}

export async function getMockPagos(id_obligacion?: number) {
  await wait();
  return id_obligacion ? mockPagos.filter((p) => p.id_obligacion === id_obligacion) : [...mockPagos];
}

export async function getMockEjecucion() { await wait(); return [...mockEjecucion]; }
