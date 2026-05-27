import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SupportTicketDocument = SupportTicket & Document;

@Schema({ timestamps: true })
export class SupportTicket {
	@Prop({ required: true })
	usuario_id: number;

	@Prop({ required: true })
	asunto: string;

	@Prop()
	categoria: string;

	@Prop({ enum: ['baja', 'media', 'alta'], default: 'media' })
	prioridad: string;

	@Prop({ enum: ['abierto', 'en_proceso', 'resuelto'], default: 'abierto' })
	estado: string;

	@Prop({ type: [Object], default: [] })
	mensajes: any[];
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);

