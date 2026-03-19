// src/components/RiskBar.tsx
// Barra de progresso horizontal que visualiza o score de 0 a 60 (máximo teórico).
// A largura é proporcional ao score; a cor reflete o nível de risco.

import { RiskLevel, RISK_CONFIG } from '@/lib/types';
import { MAX_RISK_SCORE } from '@/lib/format';

interface Props {
  score: number;
  level: RiskLevel;
}

export function RiskBar({ score, level }: Props) {
  const pct = Math.min((score / MAX_RISK_SCORE) * 100, 100);
  const cfg = RISK_CONFIG[level];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-mono text-argos-dim">score de risco</span>
        <span className={`text-xs font-mono font-bold ${cfg.color}`}>
          {score} / {MAX_RISK_SCORE}
        </span>
      </div>
      <div className="h-1.5 w-full bg-argos-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: cfg.barColor,
            boxShadow: `0 0 8px ${cfg.barColor}80`,
          }}
        />
      </div>
    </div>
  );
}
