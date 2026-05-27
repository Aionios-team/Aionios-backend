import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HorarioDocument = Horario & Document;

@Schema({ timestamps: true })
export class Horario {
	@Prop({ required: true })
	negocio_id: number;

	@Prop({ type: Object, default: {} })
	configuracion_semanal: any;

	@Prop({ type: [Object], default: [] })
	excepciones_y_festivos: any[];
}

export const HorarioSchema = SchemaFactory.createForClass(Horario);

