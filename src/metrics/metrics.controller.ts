import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('metrics')
@Roles('super administrador')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  // GET /metrics/red — Rate, Errors, Duration por endpoint
  @Get('red')
  red() {
    return this.metricsService.getRedMetrics();
  }

  // GET /metrics/business — registros, citas, pagos
  @Get('business')
  business() {
    return this.metricsService.getBusinessMetrics();
  }
}
