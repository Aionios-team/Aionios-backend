import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.solicitud.create({ data });
  }

  findAll() {
    return this.prisma.solicitud.findMany();
  }

  async findOne(id: number) {
    const req = await this.prisma.solicitud.findUnique({ where: { id } });
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
