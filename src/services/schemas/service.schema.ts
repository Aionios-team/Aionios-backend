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

	@Prop({ enum: ['tiempo_fijo', 'por_hora', 'cotizacion_requerida'] })
	tipo_cobro: string;

	@Prop({ type: Number })
	precio_base: number;

	@Prop({ type: Number, nullable: true })
	duracion_minutos?: number;

	@Prop({ type: Object, default: {} })
	campos_adicionales?: any;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

