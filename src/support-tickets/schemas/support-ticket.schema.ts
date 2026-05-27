import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SupportTicketDocument = SupportTicket & Document;

@Schema({ timestamps: true })
export class SupportTicket {
	@Prop({ required: true })
	usuario_id: number;

	@Prop({ required: true })
	asunto: string;

	@Prop({ type: [Object], default: [] })
	mensajes: any[];

	@Prop({ default: 'abierto' })
	estado: string;
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);

