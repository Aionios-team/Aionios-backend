import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BusinessUiConfigDocument = BusinessUiConfig & Document;

@Schema({ timestamps: true })
export class BusinessUiConfig {
  @Prop({ required: true, unique: true })
  negocio_id: number;

  @Prop({ default: '#4F46E5' })
  color_primario: string;

  @Prop({ default: '' })
  slogan: string;

  @Prop({ default: '' })
  descripcion_corta: string;
}

export const BusinessUiConfigSchema = SchemaFactory.createForClass(BusinessUiConfig);
