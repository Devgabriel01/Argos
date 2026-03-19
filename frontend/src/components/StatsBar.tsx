'use client';

// src/components/StatsBar.tsx
// Barra de estatísticas no topo do dashboard: total de contratos, soma de valores
// e contagem por nível de risco. Calculado em runtime a partir da lista.

import { Contract, RiskLevel, RISK_CONFIG } from '@/lib/types';
import { formatCurrency } from '@/lib/format';

interface Props {
  contracts: Contract[];
}

export function StatsBar({ contracts }: Props) {
  const total = contracts.length;
  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);

  const byLevel = (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as RiskLevel[]).map(
    (level) => ({
      level,
      count: contracts.filter((c) => c.riskLevel === level).length,
      cfg: RISK_CONFIG[level],
    }),
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      {/* Total */}
      <StatCard label="Total de Contratos" value={String(total)} accent="#4f7ef8" />

      {/* Soma de valores */}
      <StatCard
        label="Valor Total"
        value={formatCurrency(totalValue)}
        accent="#4f7ef8"
        wide
      />

      {/* Por nível */}
      {byLevel.map(({ level, count, cfg }) => (
        <StatCard
          key={level}
          label={cfg.label}
          value={String(count)}
          accent={cfg.barColor}
        />
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  wide,
}: {
  label: string;
  value: string;
  accent: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`relative rounded-xl border border-argos-border bg-argos-surface p-4 ${wide ? 'col-span-2 sm:col-span-1' : ''}`}
      style={{ boxShadow: `inset 0 1px 0 ${accent}30` }}
    >
      <div
        className="absolute top-0 left-4 right-4 h-px rounded-full"
        style={{ backgroundColor: accent, opacity: 0.5 }}
      />
      <p className="text-xs font-mono text-argos-dim mb-1 uppercase tracking-wider">
        {label}
      </p>
      <p
        className="text-lg font-mono font-bold truncate"
        style={{ color: accent }}
      >
        {value}
      </p>
    </div>
  );
}
