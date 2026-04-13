"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import type { CatalogoPresupuestalNodoDto } from "@/core";

interface CatalogoTreeProps {
  nodes: CatalogoPresupuestalNodoDto[];
  title: string;
  onSelectMovimiento?: (node: CatalogoPresupuestalNodoDto) => void;
  selectedCodigo?: string | null;
}

export function CatalogoTree({
  nodes,
  title,
  onSelectMovimiento,
  selectedCodigo,
}: CatalogoTreeProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filteredNodes = useMemo(
    () => filterTree(nodes, query.trim().toLowerCase()),
    [nodes, query],
  );

  const toggle = (codigo: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(codigo)) next.delete(codigo);
      else next.add(codigo);
      return next;
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-widest text-[#00284d]">{title}</p>
        <div className="relative w-full max-w-xs">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por codigo o nombre..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#d5bb87]/40"
          />
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {filteredNodes.length === 0 ? (
          <p className="text-xs text-slate-400 px-6 py-8">Sin resultados para ese filtro.</p>
        ) : (
          <ul className="divide-y divide-slate-50">
            {filteredNodes.map((node) => (
              <TreeNode
                key={node.codigo}
                node={node}
                depth={0}
                expanded={expanded}
                toggle={toggle}
                onSelectMovimiento={onSelectMovimiento}
                selectedCodigo={selectedCodigo}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TreeNode({
  node,
  depth,
  expanded,
  toggle,
  onSelectMovimiento,
  selectedCodigo,
}: {
  node: CatalogoPresupuestalNodoDto;
  depth: number;
  expanded: Set<string>;
  toggle: (codigo: string) => void;
  onSelectMovimiento?: (node: CatalogoPresupuestalNodoDto) => void;
  selectedCodigo?: string | null;
}) {
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isExpanded = expanded.has(node.codigo);
  const isSelected = selectedCodigo === node.codigo;

  return (
    <li>
      <div
        className={`px-4 py-3 flex items-center gap-2 ${isSelected ? "bg-[#00284d]/5" : "hover:bg-slate-50/60"}`}
        style={{ paddingLeft: 16 + depth * 18 }}
      >
        {hasChildren ? (
          <button onClick={() => toggle(node.codigo)} className="text-slate-400 hover:text-slate-600">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-[14px]" />
        )}

        <span className="text-[11px] font-mono text-[#00284d] font-bold">{node.codigo}</span>
        <span className="text-xs text-slate-700 flex-1">{node.nombre}</span>
        {node.permite_movimiento ? (
          <button
            onClick={() => onSelectMovimiento?.(node)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${
              isSelected
                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-100"
            }`}
          >
            Seleccionar
          </button>
        ) : (
          <span className="px-2 py-1 rounded-lg text-[10px] font-black border bg-slate-100 text-slate-500 border-slate-200">
            Nodo
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <ul>
          {node.children.map((child) => (
            <TreeNode
              key={child.codigo}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              toggle={toggle}
              onSelectMovimiento={onSelectMovimiento}
              selectedCodigo={selectedCodigo}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function filterTree(nodes: CatalogoPresupuestalNodoDto[], query: string): CatalogoPresupuestalNodoDto[] {
  if (!query) return nodes;

  return nodes
    .map((node) => {
      const filteredChildren = filterTree(node.children ?? [], query);
      const selfMatch =
        node.codigo.toLowerCase().includes(query) ||
        node.nombre.toLowerCase().includes(query);

      if (!selfMatch && filteredChildren.length === 0) return null;

      return {
        ...node,
        children: filteredChildren,
      };
    })
    .filter((node): node is CatalogoPresupuestalNodoDto => node !== null);
}
