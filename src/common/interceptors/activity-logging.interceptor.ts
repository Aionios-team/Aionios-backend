import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { ActivityLogsService } from '../../activity-logs/activity-logs.service';

@Injectable()
export class ActivityLoggingInterceptor implements NestInterceptor {
  constructor(
    private activityLogsService: ActivityLogsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const path = request.url;
    const userId = request.user?.sub ?? request.user?.id ?? null;

    return next.handle().pipe(
      tap(() => {
        void this.activityLogsService.create({
          usuario_id: userId,
          accion: `${method} ${path}`,
          metadata: {
            ip: request.ip,
            userAgent: request.headers['user-agent'],
            endpoint_hit: path,
          },
          timestamp: new Date(),
        });
      }),
    );
  }
}
