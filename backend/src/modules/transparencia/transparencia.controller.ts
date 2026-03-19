import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TransparenciaService } from './transparencia.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transparencia')
export class TransparenciaController {
  constructor(private transparenciaService: TransparenciaService) {}

  @Post('importar/orgao')
  importarPorOrgao(@Body() body: { codigoOrgao: string; pagina?: number }) {
    return this.transparenciaService.importarPorOrgao(body.codigoOrgao, body.pagina || 1);
  }

  @Post('importar/fornecedor')
  importarPorFornecedor(@Body() body: { cnpj: string; pagina?: number }) {
    return this.transparenciaService.importarPorFornecedor(body.cnpj, body.pagina || 1);
  }
}
