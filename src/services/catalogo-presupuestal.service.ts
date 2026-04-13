import type { CatalogoPresupuestalNodoDto, CatalogoTipo } from "@/core";
import catalogoMock from "@/data/catalogo_presupuestal_mock.json";

type CatalogoPayload = {
  catalogo_presupuestal: CatalogoPresupuestalNodoDto[];
};

export interface CatalogoPresupuestalDataSource {
  getTree(): Promise<CatalogoPresupuestalNodoDto[]>;
}

class LocalCatalogoDataSource implements CatalogoPresupuestalDataSource {
  async getTree(): Promise<CatalogoPresupuestalNodoDto[]> {
    const data = catalogoMock as CatalogoPayload;
    return normalizeNodes(data.catalogo_presupuestal);
  }
}

function normalizeNodes(nodes: CatalogoPresupuestalNodoDto[]): CatalogoPresupuestalNodoDto[] {
  return nodes.map((node) => ({
    ...node,
    apropiacion_inicial: node.apropiacion_inicial ?? 0,
    presupuesto_vigente: node.presupuesto_vigente ?? 0,
    unidad_ejecutora: node.unidad_ejecutora ?? "No definida",
    children: normalizeNodes(node.children ?? []),
  }));
}

export function flattenCatalogo(nodes: CatalogoPresupuestalNodoDto[]): CatalogoPresupuestalNodoDto[] {
  return nodes.flatMap((node) => [node, ...flattenCatalogo(node.children || [])]);
}

class CatalogoPresupuestalService {
  constructor(private readonly dataSource: CatalogoPresupuestalDataSource) {}

  async getTree(): Promise<CatalogoPresupuestalNodoDto[]> {
    return this.dataSource.getTree();
  }

  async getTreeByTipo(tipo: CatalogoTipo): Promise<CatalogoPresupuestalNodoDto[]> {
    const tree = await this.getTree();
    return tree.filter((n) => n.tipo === tipo);
  }

  async getMovimientoNodes(tipo?: CatalogoTipo): Promise<CatalogoPresupuestalNodoDto[]> {
    const tree = tipo ? await this.getTreeByTipo(tipo) : await this.getTree();
    return flattenCatalogo(tree).filter((n) => n.permite_movimiento);
  }

  async getNodeByCodigo(codigo: string): Promise<CatalogoPresupuestalNodoDto | null> {
    const tree = await this.getTree();
    return flattenCatalogo(tree).find((n) => n.codigo === codigo) ?? null;
  }

  async getPathByCodigo(codigo: string): Promise<CatalogoPresupuestalNodoDto[]> {
    const tree = await this.getTree();
    const path = findPath(tree, codigo);
    return path ?? [];
  }
}

function findPath(nodes: CatalogoPresupuestalNodoDto[], codigo: string): CatalogoPresupuestalNodoDto[] | null {
  for (const node of nodes) {
    if (node.codigo === codigo) return [node];
    const childPath = findPath(node.children || [], codigo);
    if (childPath) return [node, ...childPath];
  }
  return null;
}

export const catalogoPresupuestalService = new CatalogoPresupuestalService(
  new LocalCatalogoDataSource(),
);
