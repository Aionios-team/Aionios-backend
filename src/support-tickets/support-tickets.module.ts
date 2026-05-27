import { Module } from '@nestjs/common';
import { SupportTicketsController } from './support-tickets.controller';
import { SupportTicketsService } from './support-tickets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportTicket, SupportTicketSchema } from './schemas/support-ticket.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SupportTicket.name, schema: SupportTicketSchema }])],
  controllers: [SupportTicketsController],
  providers: [SupportTicketsService]
})
export class SupportTicketsModule {}
