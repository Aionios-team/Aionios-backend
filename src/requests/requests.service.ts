import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const userSelect = {
  id: true, nombre: true, apellido: true, email: true, telefono: true,
};

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.solicitud.create({ data });
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

  async findOne(id: number) {
    const req = await this.prisma.solicitud.findUnique({
      where: { id },
      include: { usuario: { select: userSelect } },
    });
    if (!req) throw new NotFoundException('Solicitud no encontrada');
    return req;
  }

  update(id: number, data: any) {
    return this.prisma.solicitud.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.solicitud.delete({ where: { id } });
  }
}
