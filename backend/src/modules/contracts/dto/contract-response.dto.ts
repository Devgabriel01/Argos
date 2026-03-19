// src/modules/contracts/dto/contract-response.dto.ts
// DTO de resposta — define o shape exato do JSON retornado pela API.
// Separar DTO da entidade Prisma garante que mudanças no banco não quebrem
// contratos da API sem intenção.

export class RiskFactorDto {
  rule: string;
  description: string;
  score: number;
}

export class AgencyDto {
  id: string;
  name: string;
  cnpj: string;
  state: string;
}

export class SupplierDto {
  id: string;
  name: string;
  cnpj: string;
  foundedAt: Date;
}

export class ContractResponseDto {
  id: string;
  number: string;
  object: string;
  value: number;
  startDate: Date;
  endDate: Date;
  competitorCount: number;
  additiveCount: number;
  riskScore: number;
  riskLevel: string;
  riskFactors: RiskFactorDto[];
  agency: AgencyDto;
  supplier: SupplierDto;
  createdAt: Date;
}
