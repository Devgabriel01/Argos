'use client';

// src/components/FilterBar.tsx
// Barra de filtros: campo de busca textual + filtro por nível de risco.
// Totalmente controlado — os estados sobem para o componente pai via callbacks.

import { RiskLevel, RISK_CONFIG } from '@/lib/types';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  levelFilter: RiskLevel | 'ALL';
  onLevelFilter: (v: RiskLevel | 'ALL') => void;
}

const LEVELS: (RiskLevel | 'ALL')[] = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export function FilterBar({ search, onSearch, levelFilter, onLevelFilter }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Campo de busca */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-argos-dim text-sm">
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por objeto, órgão ou fornecedor..."
          className="
            w-full pl-9 pr-4 py-2.5 rounded-lg
            bg-argos-surface border border-argos-border
            text-sm font-mono text-argos-text placeholder:text-argos-dim
            focus:outline-none focus:border-argos-accent/60
            transition-colors
          "
        />
      </div>

      {/* Filtros por nível */}
      <div className="flex gap-2 flex-wrap">
        {LEVELS.map((lvl) => {
          const isActive = levelFilter === lvl;
          const cfg = lvl !== 'ALL' ? RISK_CONFIG[lvl] : null;

          return (
            <button
              key={lvl}
              onClick={() => onLevelFilter(lvl)}
              className={`
                px-3 py-2 rounded-lg text-xs font-mono font-bold tracking-wider border transition-all
                ${isActive
                  ? cfg
                    ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                    : 'bg-argos-accent/20 border-argos-accent/50 text-argos-accent'
                  : 'bg-argos-surface border-argos-border text-argos-dim hover:border-argos-muted'
                }
              `}
            >
              {lvl === 'ALL' ? 'TODOS' : RISK_CONFIG[lvl].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
