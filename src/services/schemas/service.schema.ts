import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
	@Prop({ required: true })
	negocio_id: number;

	@Prop({ required: true })
	nombre: string;

	@Prop()
	descripcion: string;

	@Prop({ type: Number, required: true })
	precio: number;

	@Prop({ type: Number })
	duracionMinutos: number;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

