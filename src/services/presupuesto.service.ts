import { apiClient } from "@/lib";
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

// Endpoints futuros — se activarán cuando el backend esté listo
const EP = {
  vigencias:       "/api/Presupuesto/vigencias",
  unidades:        "/api/Presupuesto/unidades",
  fuentes:         "/api/Presupuesto/fuentes",
  centros:         "/api/Presupuesto/centros-costo",
  rubros:          "/api/Presupuesto/rubros",
  proyectos:       "/api/Presupuesto/proyectos",
  presupuestos:    "/api/Presupuesto",
  modificaciones:  "/api/Presupuesto/modificaciones",
  cdps:            "/api/Presupuesto/cdp",
  rps:             "/api/Presupuesto/rp",
  obligaciones:    "/api/Presupuesto/obligaciones",
  pagos:           "/api/Presupuesto/pagos",
  ejecucion:       "/api/Presupuesto/ejecucion",
} as const;

class PresupuestoService {
  async getVigencias()  { try { return await apiClient.get(EP.vigencias);  } catch { return getMockVigencias(); } }
  async getUnidades()   { try { return await apiClient.get(EP.unidades);   } catch { return getMockUnidades(); } }
  async getFuentes()    { try { return await apiClient.get(EP.fuentes);    } catch { return getMockFuentes(); } }
  async getCentros()    { try { return await apiClient.get(EP.centros);    } catch { return getMockCentros(); } }
  async getRubros()     { try { return await apiClient.get(EP.rubros);     } catch { return getMockRubros(); } }
  async getProyectos()  { try { return await apiClient.get(EP.proyectos);  } catch { return getMockProyectos(); } }
  async getEjecucion()  { try { return await apiClient.get(EP.ejecucion);  } catch { return getMockEjecucion(); } }

  async getPresupuestos(id_vigencia?: number) {
    try { return await apiClient.get(EP.presupuestos, id_vigencia ? { id_vigencia } : undefined); }
    catch { return getMockPresupuestos(id_vigencia); }
  }

  async getModificaciones(id_presupuesto?: number) {
    try { return await apiClient.get(EP.modificaciones, id_presupuesto ? { id_presupuesto } : undefined); }
    catch { return getMockModificaciones(id_presupuesto); }
  }

  async getCdps(id_presupuesto?: number) {
    try { return await apiClient.get(EP.cdps, id_presupuesto ? { id_presupuesto } : undefined); }
    catch { return getMockCdps(id_presupuesto); }
  }

  async getRps(id_cdp?: number) {
    try { return await apiClient.get(EP.rps, id_cdp ? { id_cdp } : undefined); }
    catch { return getMockRps(id_cdp); }
  }

  async getObligaciones(id_rp?: number) {
    try { return await apiClient.get(EP.obligaciones, id_rp ? { id_rp } : undefined); }
    catch { return getMockObligaciones(id_rp); }
  }

  async getPagos(id_obligacion?: number) {
    try { return await apiClient.get(EP.pagos, id_obligacion ? { id_obligacion } : undefined); }
    catch { return getMockPagos(id_obligacion); }
  }
}

export const presupuestoService = new PresupuestoService();
