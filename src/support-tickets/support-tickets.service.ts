import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupportTicket, SupportTicketDocument } from './schemas/support-ticket.schema';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';

@Injectable()
export class SupportTicketsService {
	constructor(@InjectModel(SupportTicket.name) private ticketModel: Model<SupportTicketDocument>) {}

	create(data: CreateSupportTicketDto) {
		return this.ticketModel.create(data);
	}

	findAll(limit = 100) {
		return this.ticketModel.find().sort({ createdAt: -1 }).limit(limit).exec();
	}

	findByUser(usuarioId: number) {
		return this.ticketModel.find({ usuario_id: usuarioId }).sort({ createdAt: -1 }).exec();
	}

	update(id: string, data: UpdateSupportTicketDto) {
		return this.ticketModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	remove(id: string) {
		return this.ticketModel.findByIdAndDelete(id).exec();
	}
}
