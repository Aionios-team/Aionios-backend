import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
	@Prop({ required: true })
	negocio_id: number;

	@Prop({ required: true })
	usuario_id: number;

	@Prop({ required: true, min: 1, max: 5 })
	rating: number;

	@Prop()
	comentario: string;

	@Prop()
	fecha: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

