import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupportTicket, SupportTicketDocument } from './schemas/support-ticket.schema';

@Injectable()
export class SupportTicketsService {
	constructor(@InjectModel(SupportTicket.name) private ticketModel: Model<SupportTicketDocument>) {}

	create(data: any) {
		return this.ticketModel.create(data);
	}

	findAll(limit = 100) {
		return this.ticketModel.find().sort({ createdAt: -1 }).limit(limit).exec();
	}

	findOne(id: string) {
		return this.ticketModel.findById(id).exec();
	}

	findByUser(usuarioId: number) {
		return this.ticketModel.find({ usuario_id: usuarioId }).sort({ createdAt: -1 }).exec();
	}

	update(id: string, data: any) {
		return this.ticketModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	addMensaje(id: string, mensaje: { autor_id: number; texto: string; autor_nombre?: string }) {
		return this.ticketModel.findByIdAndUpdate(
			id,
			{ $push: { mensajes: { ...mensaje, fecha: new Date() } } },
			{ new: true },
		).exec();
	}

	remove(id: string) {
		return this.ticketModel.findByIdAndDelete(id).exec();
	}
}
