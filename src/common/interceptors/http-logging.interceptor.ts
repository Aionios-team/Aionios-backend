import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  Optional,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CORRELATION_ID_HEADER } from '../middleware/correlation-id.middleware';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @Optional() private readonly metricsService?: MetricsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      headers: Record<string, string>;
      user?: { sub?: number; email?: string };
      ip: string;
    }>();

    const { method, url, headers, user, ip } = req;
    const correlationId = headers[CORRELATION_ID_HEADER];
    const start = Date.now();

    this.logger.log(
      { message: `→ ${method} ${url}`, correlationId, ip, userId: user?.sub },
      'HTTP',
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse<{ statusCode: number }>();
          const duration = Date.now() - start;
          const level = res.statusCode >= 400 ? 'warn' : 'log';

          this.logger[level](
            {
              message: `← ${method} ${url} ${res.statusCode} (${duration}ms)`,
              correlationId,
              statusCode: res.statusCode,
              durationMs: duration,
              userId: user?.sub,
            },
            'HTTP',
          );

          this.metricsService?.record(method, url, res.statusCode, duration);
        },
        error: (err: { status?: number; message?: string }) => {
          const duration = Date.now() - start;
          const statusCode = err.status ?? 500;

          this.logger.error(
            {
              message: `← ${method} ${url} ${statusCode} (${duration}ms)`,
              correlationId,
              statusCode,
              durationMs: duration,
              error: err.message,
              userId: user?.sub,
            },
            'HTTP',
          );

          this.metricsService?.record(method, url, statusCode, duration);
        },
      }),
    );
  }
}
