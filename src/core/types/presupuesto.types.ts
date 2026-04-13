// ─── Catálogo / Estructura ───────────────────────────────────────────────────

export interface VigenciaDto {
  id_vigencia: number;
  anio: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: "Abierta" | "Cerrada";
}

export interface UnidadEjecutoraDto {
  id_unidad: number;
  codigo: string;
  nombre: string;
}

export interface FuenteFinanciacionDto {
  id_fuente: number;
  codigo: string;
  nombre: string;
}

export interface CentroCostoDto {
  id_centro: number;
  codigo: string;
  nombre: string;
  id_tipo: number;
  tipo_nombre: string;
}

export interface CatalogoPresupuestalDto {
  id_catalogo: number;
  codigo: string;
  nombre: string;
  id_padre: number | null;
}

export type CatalogoTipo = "ingreso" | "gasto";

export interface CatalogoPresupuestalNodoDto {
  codigo: string;
  nombre: string;
  nivel: number;
  tipo: CatalogoTipo;
  padre: string | null;
  permite_movimiento: boolean;
  unidad_ejecutora?: string | null;
  apropiacion_inicial?: number;
  presupuesto_vigente?: number;
  children: CatalogoPresupuestalNodoDto[];
}

export interface RubroPresupuestalDto {
  id_rubro: number;
  codigo_catalogo: string;
  nombre: string;
  tipo: "Ingreso" | "Gasto" | "Inversión" | "Transferencia";
  id_unidad: number;
  unidad_nombre: string;
}

export interface ProyectoDto {
  id_proyecto: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

// ─── Presupuesto ─────────────────────────────────────────────────────────────

export interface PresupuestoDto {
  id_presupuesto: number;
  id_vigencia: number;
  anio: number;
  id_rubro: number;
  rubro_nombre: string;
  rubro_tipo: string;
  id_fuente: number;
  fuente_nombre: string;
  id_centro: number;
  centro_nombre: string;
  id_proyecto: number | null;
  proyecto_nombre: string | null;
  apropiacion_inicial: number;
  presupuesto_vigente: number;
}

export interface ModificacionPresupuestalDto {
  id_modificacion: number;
  id_presupuesto: number;
  rubro_nombre: string;
  tipo: "Adición" | "Reducción" | "Traslado";
  valor: number;
  fecha: string;
}

// ─── Flujo de ejecución: CDP → RP → Obligación → Pago ────────────────────────

export interface CdpDto {
  id_cdp: number;
  id_presupuesto: number;
  rubro_nombre: string;
  numero: string;
  valor: number;
  fecha: string;
  estado: "Vigente" | "Comprometido" | "Anulado";
}

export interface RpDto {
  id_rp: number;
  id_cdp: number;
  cdp_numero: string;
  numero: string;
  valor: number;
  fecha: string;
  estado: "Activo" | "Obligado" | "Anulado";
}

export interface ObligacionDto {
  id_obligacion: number;
  id_rp: number;
  rp_numero: string;
  numero: string;
  valor: number;
  fecha: string;
  estado: "Pendiente" | "Pagada" | "Anulada";
}

export interface PagoDto {
  id_pago: number;
  id_obligacion: number;
  obligacion_numero: string;
  numero: string;
  valor: number;
  fecha: string;
}

// ─── Vistas consolidadas (equivalen a las vistas SQL del ER) ─────────────────

export interface EjecucionPresupuestalDto {
  id_presupuesto: number;
  rubro_nombre: string;
  rubro_tipo: string;
  fuente_nombre: string;
  centro_nombre: string;
  apropiacion_inicial: number;
  presupuesto_vigente: number;
  comprometido: number;   // suma CDPs vigentes
  obligado: number;       // suma RPs obligados
  pagado: number;         // suma pagos
  disponible: number;     // presupuesto_vigente - comprometido
}
