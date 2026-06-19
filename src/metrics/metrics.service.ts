import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface EndpointStats {
  requests: number;
  errors: number;
  totalDurationMs: number;
  durations: number[];
}

@Injectable()
export class MetricsService {
  private readonly stats = new Map<string, EndpointStats>();
  private readonly startTime = Date.now();

  constructor(private prisma: PrismaService) {}

  // Llamado por HttpLoggingInterceptor en cada request
  record(method: string, path: string, statusCode: number, durationMs: number) {
    // Normaliza paths con IDs: /users/42 → /users/:id
    const normalizedPath = path.replace(/\/\d+/g, '/:id');
    const key = `${method} ${normalizedPath}`;

    const existing = this.stats.get(key) ?? {
      requests: 0,
      errors: 0,
      totalDurationMs: 0,
      durations: [],
    };

    existing.requests += 1;
    if (statusCode >= 400) existing.errors += 1;
    existing.totalDurationMs += durationMs;
    existing.durations.push(durationMs);
    // Mantener solo los últimos 1000 para no acumular memoria
    if (existing.durations.length > 1000) existing.durations.shift();

    this.stats.set(key, existing);
  }

  // RED metrics: Rate, Errors, Duration por endpoint
  getRedMetrics() {
    const uptimeSecs = (Date.now() - this.startTime) / 1000;
    const endpoints: Record<string, unknown>[] = [];

    for (const [endpoint, s] of this.stats.entries()) {
      const sorted = [...s.durations].sort((a, b) => a - b);
      const p95Index = Math.floor(sorted.length * 0.95);

      endpoints.push({
        endpoint,
        rate_per_min: parseFloat(((s.requests / uptimeSecs) * 60).toFixed(2)),
        total_requests: s.requests,
        error_count: s.errors,
        error_rate_pct: parseFloat(((s.errors / s.requests) * 100).toFixed(2)),
        avg_duration_ms: parseFloat((s.totalDurationMs / s.requests).toFixed(2)),
        p95_duration_ms: sorted[p95Index] ?? 0,
      });
    }

    return {
      uptime_secs: Math.floor(uptimeSecs),
      collected_at: new Date().toISOString(),
      endpoints: endpoints.sort(
        (a, b) => (b['total_requests'] as number) - (a['total_requests'] as number),
      ),
    };
  }

  // Business metrics: usuarios, solicitudes, pagos
  async getBusinessMetrics() {
    const [totalUsuarios, totalNegocios, totalSolicitudes, solicitudesPorEstado, totalPagos] =
      await Promise.all([
        this.prisma.usuario.count(),
        this.prisma.negocio.count(),
        this.prisma.solicitud.count(),
        this.prisma.solicitud.groupBy({
          by: ['estado'],
          _count: { estado: true },
        }),
        this.prisma.pago.count(),
      ]);

    const haceUnaSemana = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [registrosUltimaSemana, citasUltimaSemana] = await Promise.all([
      this.prisma.usuario.count({ where: { fecha_registro: { gte: haceUnaSemana } } }),
      this.prisma.solicitud.count({ where: { fecha_hora_propuesta: { gte: haceUnaSemana } } }),
    ]);

    return {
      collected_at: new Date().toISOString(),
      usuarios: {
        total: totalUsuarios,
        registros_ultima_semana: registrosUltimaSemana,
      },
      negocios: { total: totalNegocios },
      solicitudes: {
        total: totalSolicitudes,
        por_estado: Object.fromEntries(
          solicitudesPorEstado.map((r) => [r.estado, r._count.estado]),
        ),
        citas_ultima_semana: citasUltimaSemana,
      },
      pagos: { total: totalPagos },
    };
  }
}
