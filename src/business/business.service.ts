import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.negocio.create({ data });
  }

  findAll() {
    return this.prisma.negocio.findMany();
  }

  findByOwner(userId: number) {
    return this.prisma.negocio.findFirst({ where: { id_dueno: userId } });
  }

  async findOne(id: number) {
    const negocio = await this.prisma.negocio.findUnique({ where: { id } });
    if (!negocio) throw new NotFoundException('Negocio no encontrado');
    return negocio;
  }

  async findBySlug(slug: string) {
    const negocio = await this.prisma.negocio.findUnique({ where: { slug } });
    if (!negocio) throw new NotFoundException('Negocio no encontrado');
    return negocio;
  }

  update(id: number, data: any) {
    return this.prisma.negocio.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.negocio.delete({ where: { id } });
  }

  assignStaff(negocioId: number, usuarioId: number) {
    return this.prisma.staff.create({ data: { negocioId, usuarioId } });
  }

  removeStaff(negocioId: number, usuarioId: number) {
    return this.prisma.staff.deleteMany({ where: { negocioId, usuarioId } });
  }

  listStaff(negocioId: number) {
    return this.prisma.staff.findMany({ where: { negocioId }, include: { usuario: true } });
  }
}
