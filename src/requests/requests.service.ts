import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RequestMessage, RequestMessageDocument } from './schemas/request-message.schema';

const userSelect = {
  id: true, nombre: true, apellido: true, email: true, telefono: true,
};

function formatFecha(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('es-MX', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    @InjectModel(RequestMessage.name)
    private messageModel: Model<RequestMessageDocument>,
  ) {}

  async create(data: any) {
    const solicitud = await this.prisma.solicitud.create({ data });

    const negocio = await this.prisma.negocio.findUnique({
      where: { id: solicitud.id_negocio },
      select: { id: true, nombre: true, id_dueno: true },
    });

    const fecha = formatFecha(solicitud.fecha_hora_propuesta);

    if (negocio) {
      void this.notificationsService.create({
        usuario_id: negocio.id_dueno,
        titulo: 'Nueva solicitud de cita',
        mensaje: `Un cliente ha solicitado una cita para el ${fecha}. Revisa el panel de solicitudes para confirmar o rechazar.`,
        leido: false,
        tipo: 'recordatorio_cita',
      });

      void this.notificationsService.create({
        usuario_id: solicitud.id_usuario,
        titulo: 'Solicitud enviada',
        mensaje: `Tu solicitud de cita en ${negocio.nombre} para el ${fecha} fue enviada. Pronto recibirás una respuesta.`,
        leido: false,
        tipo: 'recordatorio_cita',
      });
    }

    return solicitud;
  }

  findAll() {
    return this.prisma.solicitud.findMany({ include: { usuario: { select: userSelect } } });
  }

  findByNegocio(negocioId: number) {
    return this.prisma.solicitud.findMany({
      where: { id_negocio: negocioId },
      include: { usuario: { select: userSelect } },
      orderBy: { fecha_hora_propuesta: 'asc' },
    });
  }

  findByUsuario(userId: number) {
    return this.prisma.solicitud.findMany({
      where: { id_usuario: userId },
      include: {
        negocio: { select: { id: true, nombre: true, slug: true, direccion: true } },
        pagos:   { select: { id: true, monto: true, metodo_pago: true, estado_pago: true } },
      },
      orderBy: { fecha_hora_propuesta: 'desc' },
    });
  }

  async findOne(id: number) {
    const req = await this.prisma.solicitud.findUnique({
      where: { id },
      include: { usuario: { select: userSelect } },
    });
    if (!req) throw new NotFoundException('Solicitud no encontrada');
    return req;
  }

  async update(id: number, data: any) {
    const solicitudActual = await this.prisma.solicitud.findUnique({
      where: { id },
      include: {
        negocio: { select: { id: true, nombre: true, id_dueno: true } },
        usuario: { select: { id: true, nombre: true } },
      },
    });

    const solicitud = await this.prisma.solicitud.update({ where: { id }, data });

    if (solicitudActual && data.estado) {
      const fecha = formatFecha(solicitudActual.fecha_hora_propuesta);
      const negocioNombre = solicitudActual.negocio.nombre;
      const clienteNombre = solicitudActual.usuario.nombre;

      if (data.estado === 'CONFIRMADA') {
        void this.notificationsService.create({
          usuario_id: solicitudActual.id_usuario,
          titulo: '¡Cita confirmada!',
          mensaje: `Tu cita en ${negocioNombre} fue confirmada para el ${fecha}. ¡Te esperamos!`,
          leido: false,
          tipo: 'recordatorio_cita',
        });
      } else if (data.estado === 'CANCELADA') {
        void this.notificationsService.create({
          usuario_id: solicitudActual.id_usuario,
          titulo: 'Cita cancelada',
          mensaje: `Tu cita en ${negocioNombre} programada para el ${fecha} fue cancelada. Puedes agendar una nueva cuando gustes.`,
          leido: false,
          tipo: 'cancelacion',
        });

        if (data.canceladoPor === 'cliente') {
          void this.notificationsService.create({
            usuario_id: solicitudActual.negocio.id_dueno,
            titulo: 'Cita cancelada por el cliente',
            mensaje: `${clienteNombre} canceló su cita programada para el ${fecha}.`,
            leido: false,
            tipo: 'cancelacion',
          });
        }
      }
    }

    return solicitud;
  }

  remove(id: number) {
    return this.prisma.solicitud.delete({ where: { id } });
  }

  /* ── Mensajes de coordinación ── */

  getMensajes(solicitudId: number) {
    return this.messageModel
      .find({ solicitud_id: solicitudId })
      .sort({ createdAt: 1 })
      .exec();
  }

  addMensaje(solicitudId: number, data: { autor_id: number; autor_nombre: string; autor_tipo: string; texto: string }) {
    return this.messageModel.create({ solicitud_id: solicitudId, ...data });
  }
}
