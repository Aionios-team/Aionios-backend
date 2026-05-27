import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateBusinessDto) {
    return this.prisma.negocio.create({ data });
  }

  findAll() {
    return this.prisma.negocio.findMany();
  }

  async findOne(id: number) {
    const negocio = await this.prisma.negocio.findUnique({ where: { id } });
    if (!negocio) throw new NotFoundException('Negocio no encontrado');
    return negocio;
  }

  update(id: number, data: UpdateBusinessDto) {
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
