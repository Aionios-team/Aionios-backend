import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoPago } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.pago.create({ data });
  }

  findAll() {
    return this.prisma.pago.findMany();
  }

  async findOne(id: number) {
    const payment = await this.prisma.pago.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Pago no encontrado');
    return payment;
  }

  update(id: number, data: any) {
    return this.prisma.pago.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.pago.delete({ where: { id } });
  }

  async updateStatusByTransaction(transactionId: string, estado_pago: EstadoPago) {
    const payment = await this.prisma.pago.findUnique({ where: { transaccion_id: transactionId } });
    if (!payment) throw new NotFoundException('Pago no encontrado por transaccion_id');
    return this.prisma.pago.update({
      where: { id: payment.id },
      data: { estado_pago },
    });
  }

  async ensureWebhookSecret(secret?: string) {
    if (!secret) throw new BadRequestException('Missing STRIPE_WEBHOOK_SECRET');
    return secret;
  }
}
