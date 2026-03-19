// src/lib/types.ts
// Tipos TypeScript que espelham o ContractResponseDto do backend.
// Mantidos aqui para serem importados por qualquer componente do frontend.

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskFactor {
  rule: string;
  description: string;
  score: number;
}

export interface Agency {
  id: string;
  name: string;
  cnpj: string;
  state: string;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  foundedAt: string;
}

export interface Contract {
  id: string;
  number: string;
  object: string;
  value: number;
  startDate: string;
  endDate: string;
  competitorCount: number;
  additiveCount: number;
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  agency: Agency;
  supplier: Supplier;
  createdAt: string;
}

// Helpers de UI derivados dos tipos de domínio
export interface RiskConfig {
  label: string;
  color: string;         // Tailwind text color
  bg: string;            // Tailwind bg color
  border: string;        // Tailwind border color
  glow: string;          // CSS box-shadow color
  barColor: string;      // Cor da barra de progresso
}

export const RISK_CONFIG: Record<RiskLevel, RiskConfig> = {
  LOW: {
    label: 'BAIXO',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/30',
    glow: 'rgba(34,197,94,0.15)',
    barColor: '#22c55e',
  },
  MEDIUM: {
    label: 'MÉDIO',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    glow: 'rgba(245,158,11,0.15)',
    barColor: '#f59e0b',
  },
  HIGH: {
    label: 'ALTO',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/30',
    glow: 'rgba(249,115,22,0.15)',
    barColor: '#f97316',
  },
  CRITICAL: {
    label: 'CRÍTICO',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/30',
    glow: 'rgba(239,68,68,0.2)',
    barColor: '#ef4444',
  },
};
