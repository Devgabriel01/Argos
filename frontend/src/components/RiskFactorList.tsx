// src/components/RiskFactorList.tsx
// Lista os fatores de risco detectados pelo motor com ícone, regra e pontuação.
// Exibida dentro do card expandido de cada contrato.

import { RiskFactor, RiskLevel, RISK_CONFIG } from '@/lib/types';

const RULE_ICONS: Record<string, string> = {
  EMPRESA_NOVA: '🏗',
  VALOR_ALTO: '💰',
  POUCOS_CONCORRENTES: '👁',
  MUITOS_ADITIVOS: '📋',
};

interface Props {
  factors: RiskFactor[];
  level: RiskLevel;
}

export function RiskFactorList({ factors, level }: Props) {
  const cfg = RISK_CONFIG[level];

  if (factors.length === 0) {
    return (
      <div className="text-xs text-argos-dim font-mono py-2">
        ✓ Nenhum fator de risco detectado
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {factors.map((factor, i) => (
        <div
          key={i}
          className={`
            flex items-start gap-3 p-3 rounded-lg
            border ${cfg.border} ${cfg.bg}
          `}
        >
          <span className="text-base mt-0.5 flex-shrink-0">
            {RULE_ICONS[factor.rule] || '⚠'}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className={`text-xs font-mono font-bold tracking-wider ${cfg.color}`}>
                {factor.rule}
              </span>
              <span className={`text-xs font-mono font-bold ${cfg.color} flex-shrink-0`}>
                +{factor.score}pt
              </span>
            </div>
            <p className="text-xs text-argos-dim leading-relaxed">
              {factor.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
