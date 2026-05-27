import { Controller, Get, Put, Param, Body, Req } from '@nestjs/common';
import { BusinessUiService } from './business-ui.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('business-ui')
export class BusinessUiController {
  constructor(private uiService: BusinessUiService) {}

  @Get('negocio/:negocioId')
  findByNegocio(@Param('negocioId') negocioId: string) {
    return this.uiService.findByNegocio(Number(negocioId));
  }

  @Put('negocio/:negocioId')
  @Roles('administrador de negocio', 'super administrador')
  upsert(@Param('negocioId') negocioId: string, @Body() body: any) {
    const { color_primario, slogan, descripcion_corta } = body;
    return this.uiService.upsertByNegocio(Number(negocioId), { color_primario, slogan, descripcion_corta });
  }
}
