import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { RiskEngineService } from '../risk-engine/risk-engine.service';

@Injectable()
export class TransparenciaService {
  constructor(private prisma: PrismaService, private riskEngine: RiskEngineService) {}

  async importarPorOrgao(codigoOrgao: string, pagina = 1) {
    const apiKey = '220dde7dcab46bc2dff6a67925455c80';
    let dados: any[];
    try {
      const res = await axios.get('https://api.portaldatransparencia.gov.br/api-de-dados/contratos', {
        params: { codigoOrgao, pagina, tamanhoPagina: 20 },
        headers: { 'chave-api-dados': apiKey },
        timeout: 30000,
      });
      dados = res.data;
    } catch (err: any) {
      throw new BadRequestException('Erro na API do Portal: ' + (err.response?.data?.message || err.message));
    }
    if (!Array.isArray(dados) || dados.length === 0) return { importados: 0, atualizados: 0, erros: 0, detalhes: [] };
    return this.processarContratos(dados);
  }

  async importarPorFornecedor(cnpj: string, pagina = 1) {
    const apiKey = '220dde7dcab46bc2dff6a67925455c80';
    const cnpjLimpo = cnpj.replace(/\\D/g, '');
    let dados: any[];
    try {
      const res = await axios.get('https://api.portaldatransparencia.gov.br/api-de-dados/contratos', {
        params: { cnpjFornecedor: cnpjLimpo, pagina, tamanhoPagina: 20 },
        headers: { 'chave-api-dados': apiKey },
        timeout: 30000,
      });
      dados = res.data;
    } catch (err: any) {
      throw new BadRequestException('Erro na API do Portal: ' + (err.response?.data?.message || err.message));
    }
    if (!Array.isArray(dados) || dados.length === 0) return { importados: 0, atualizados: 0, erros: 0, detalhes: [] };
    return this.processarContratos(dados);
  }

  private async processarContratos(dados: any[]) {
    let importados = 0, atualizados = 0, erros = 0;
    const detalhes: string[] = [];
    for (const item of dados) {
      try {
        const numero = item.numero || item.id?.toString() || 'PT-' + Date.now();
        const objeto = item.objeto || item.descricao || 'Objeto nao especificado';
        const valor = parseFloat(item.valorInicial || item.valor || '0');
        const startDate = item.dataInicioVigencia ? new Date(item.dataInicioVigencia) : new Date();
        const endDate = item.dataFimVigencia ? new Date(item.dataFimVigencia) : new Date(Date.now() + 365*24*60*60*1000);
        const orgaoNome = item.unidadeGestora?.orgaoVinculado?.nome || 'Orgao nao identificado';
        const orgaoCnpj = item.unidadeGestora?.cnpj || '0000000000' + Math.floor(Math.random()*9999);
        const orgaoUf = item.unidadeGestora?.orgaoVinculado?.uf || 'DF';
        const fornecedorNome = item.fornecedor?.nome || 'Fornecedor nao identificado';
        const fornecedorCnpj = item.fornecedor?.cnpj || '1000000000' + Math.floor(Math.random()*9999);
        const agency = await this.prisma.agency.upsert({ where: { cnpj: orgaoCnpj }, update: { name: orgaoNome }, create: { name: orgaoNome, cnpj: orgaoCnpj, state: orgaoUf } });
        const supplier = await this.prisma.supplier.upsert({ where: { cnpj: fornecedorCnpj }, update: { name: fornecedorNome }, create: { name: fornecedorNome, cnpj: fornecedorCnpj, foundedAt: new Date('2020-01-01') } });
        const riskResult = this.riskEngine.calculate({ value: valor, supplierFoundedAt: supplier.foundedAt, competitorCount: 1, additiveCount: 0, contractStartDate: startDate });
        const existing = await this.prisma.contract.findUnique({ where: { number: numero } });
        if (existing) {
          await this.prisma.contract.update({ where: { number: numero }, data: { riskScore: riskResult.score, riskLevel: riskResult.level, riskFactors: JSON.stringify(riskResult.factors), source: 'PORTAL_TRANSPARENCIA' } });
          atualizados++;
        } else {
          await this.prisma.contract.create({ data: { number: numero, object: objeto, value: valor, startDate, endDate, competitorCount: 1, riskScore: riskResult.score, riskLevel: riskResult.level, riskFactors: JSON.stringify(riskResult.factors), source: 'PORTAL_TRANSPARENCIA', agencyId: agency.id, supplierId: supplier.id } });
          importados++;
        }
        detalhes.push('OK: ' + numero + ' - ' + riskResult.level + ' (' + riskResult.score + 'pts)');
      } catch (err: any) {
        erros++;
        detalhes.push('ERRO: ' + err.message);
      }
    }
    return { importados, atualizados, erros, detalhes };
  }
}
