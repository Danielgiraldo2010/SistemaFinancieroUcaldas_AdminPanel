import {
  getMockVigencias,
  getMockUnidades,
  getMockFuentes,
  getMockCentros,
  getMockRubros,
  getMockProyectos,
  getMockPresupuestos,
  getMockModificaciones,
  getMockCdps,
  getMockRps,
  getMockObligaciones,
  getMockPagos,
  getMockEjecucion,
} from "@/lib/dashboard-mocks";

class PresupuestoService {
  async getVigencias()  { return getMockVigencias(); }
  async getUnidades()   { return getMockUnidades(); }
  async getFuentes()    { return getMockFuentes(); }
  async getCentros()    { return getMockCentros(); }
  async getRubros()     { return getMockRubros(); }
  async getProyectos()  { return getMockProyectos(); }
  async getEjecucion()  { return getMockEjecucion(); }

  async getPresupuestos(id_vigencia?: number) {
    return getMockPresupuestos(id_vigencia);
  }

  async getModificaciones(id_presupuesto?: number) {
    return getMockModificaciones(id_presupuesto);
  }

  async getCdps(id_presupuesto?: number) {
    return getMockCdps(id_presupuesto);
  }

  async getRps(id_cdp?: number) {
    return getMockRps(id_cdp);
  }

  async getObligaciones(id_rp?: number) {
    return getMockObligaciones(id_rp);
  }

  async getPagos(id_obligacion?: number) {
    return getMockPagos(id_obligacion);
  }
}

export const presupuestoService = new PresupuestoService();
