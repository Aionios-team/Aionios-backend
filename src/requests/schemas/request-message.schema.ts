import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RequestMessageDocument = RequestMessage & Document;

@Schema({ timestamps: true })
export class RequestMessage {
  @Prop({ required: true })
  solicitud_id: number;

  @Prop({ required: true })
  autor_id: number;

  @Prop({ required: true })
  autor_nombre: string;

  @Prop({ enum: ['cliente', 'negocio'], required: true })
  autor_tipo: string;

  @Prop({ required: true })
  texto: string;
}

export const RequestMessageSchema = SchemaFactory.createForClass(RequestMessage);
