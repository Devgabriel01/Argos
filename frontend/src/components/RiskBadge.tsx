// src/components/RiskBadge.tsx
// Badge colorido que exibe o nível de risco semântico (LOW/MEDIUM/HIGH/CRITICAL).
// Usado no header de cada card de contrato.

import { RiskLevel, RISK_CONFIG } from '@/lib/types';

interface Props {
  level: RiskLevel;
  score: number;
}

export function RiskBadge({ level, score }: Props) {
  const cfg = RISK_CONFIG[level];

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest
      border ${cfg.bg} ${cfg.border} ${cfg.color}
    `}>
      {/* Indicador pulsante para risco crítico */}
      {level === 'CRITICAL' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
        </span>
      )}
      {level !== 'CRITICAL' && (
        <span className={`h-1.5 w-1.5 rounded-full`} style={{ backgroundColor: cfg.barColor }} />
      )}
      {cfg.label}
      <span className={`opacity-60`}>·</span>
      <span>{score}pt</span>
    </div>
  );
}
