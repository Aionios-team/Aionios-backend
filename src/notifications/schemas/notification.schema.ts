import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
	@Prop({ required: true })
	usuario_id: number;

	@Prop({ required: true })
	titulo: string;

	@Prop()
	mensaje: string;

	@Prop({ default: false })
	leido: boolean;

	@Prop({ enum: ['recordatorio_cita', 'pago_exitoso', 'cancelacion'], default: 'recordatorio_cita' })
	tipo: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
