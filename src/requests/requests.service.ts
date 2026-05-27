import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateRequestDto) {
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

  update(id: number, data: UpdateRequestDto) {
    return this.prisma.solicitud.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.solicitud.delete({ where: { id } });
  }
}
