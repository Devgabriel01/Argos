'use client';

// src/components/ContractCard.tsx
// Card principal de cada contrato. Exibe dados resumidos e pode ser expandido
// para mostrar os fatores de risco detalhados. Usa estado local para toggle.

import { useState } from 'react';
import { Contract, RISK_CONFIG } from '@/lib/types';
import { formatCurrency, formatDate, formatCNPJ } from '@/lib/format';
import { RiskBadge } from './RiskBadge';
import { RiskBar } from './RiskBar';
import { RiskFactorList } from './RiskFactorList';

interface Props {
  contract: Contract;
  index: number;
}

export function ContractCard({ contract, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const cfg = RISK_CONFIG[contract.riskLevel];

  return (
    <div
      className="group relative rounded-xl border bg-argos-surface transition-all duration-300"
      style={{
        borderColor: expanded ? cfg.barColor + '60' : '#1e2130',
        boxShadow: expanded ? `0 0 24px ${cfg.glow}` : 'none',
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Linha de acento colorida no topo do card */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full opacity-60"
        style={{ backgroundColor: cfg.barColor }}
      />

      {/* Header clicável do card */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 focus:outline-none"
      >
        {/* Linha 1: número + badge de risco */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-argos-dim">
                {contract.number}
              </span>
              <span className="text-argos-muted">·</span>
              <span className="text-xs font-mono text-argos-dim">
                {contract.agency.state}
              </span>
            </div>
            <h3 className="text-sm font-sans font-medium text-argos-text leading-snug line-clamp-2 group-hover:text-white transition-colors">
              {contract.object}
            </h3>
          </div>
          <div className="flex-shrink-0">
            <RiskBadge level={contract.riskLevel} score={contract.riskScore} />
          </div>
        </div>

        {/* Linha 2: valor + datas */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mb-4">
          <span className="text-base font-mono font-bold text-argos-text">
            {formatCurrency(contract.value)}
          </span>
          <span className="text-xs font-mono text-argos-dim">
            {formatDate(contract.startDate)} → {formatDate(contract.endDate)}
          </span>
        </div>

        {/* Barra de risco */}
        <RiskBar score={contract.riskScore} level={contract.riskLevel} />

        {/* Linha 3: metadados resumidos */}
        <div className="flex flex-wrap gap-3 mt-3">
          <MetaChip icon="🏛" label={contract.agency.name.split('—')[0].trim()} />
          <MetaChip icon="🏢" label={contract.supplier.name} />
          <MetaChip icon="👥" label={`${contract.competitorCount} concorrente(s)`} />
          <MetaChip icon="📋" label={`${contract.additiveCount} aditivo(s)`} />
        </div>

        {/* Toggle hint */}
        <div className={`flex items-center gap-1 mt-3 text-xs font-mono transition-colors ${cfg.color} opacity-60`}>
          <span>{expanded ? '▲ ocultar fatores' : '▼ ver fatores de risco'}</span>
        </div>
      </button>

      {/* Seção expandida: fatores de risco + detalhes */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-argos-border">
          <div className="pt-4 space-y-4">

            {/* Fatores de risco */}
            <div>
              <h4 className="text-xs font-mono text-argos-dim uppercase tracking-widest mb-3">
                Fatores de Risco Detectados
              </h4>
              <RiskFactorList
                factors={contract.riskFactors}
                level={contract.riskLevel}
              />
            </div>

            {/* Dados do fornecedor */}
            <div>
              <h4 className="text-xs font-mono text-argos-dim uppercase tracking-widest mb-2">
                Fornecedor
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <InfoRow label="Nome" value={contract.supplier.name} />
                <InfoRow label="CNPJ" value={formatCNPJ(contract.supplier.cnpj)} />
                <InfoRow
                  label="Fundação"
                  value={formatDate(contract.supplier.foundedAt)}
                />
              </div>
            </div>

            {/* Dados do órgão */}
            <div>
              <h4 className="text-xs font-mono text-argos-dim uppercase tracking-widest mb-2">
                Órgão Contratante
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <InfoRow label="Nome" value={contract.agency.name} />
                <InfoRow label="CNPJ" value={formatCNPJ(contract.agency.cnpj)} />
                <InfoRow label="Estado" value={contract.agency.state} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-componente: chip de metadado com ícone
function MetaChip({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-argos-muted/50 border border-argos-border">
      <span className="text-xs">{icon}</span>
      <span className="text-xs font-mono text-argos-dim truncate max-w-[160px]">
        {label}
      </span>
    </div>
  );
}

// Sub-componente: linha de informação chave-valor
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-argos-dim text-[10px] uppercase tracking-wider">{label}</span>
      <span className="text-argos-text">{value}</span>
    </div>
  );
}
