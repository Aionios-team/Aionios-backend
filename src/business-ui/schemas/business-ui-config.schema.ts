import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BusinessUiConfigDocument = BusinessUiConfig & Document;

@Schema({ timestamps: true })
export class BusinessUiConfig {
	@Prop({ required: true })
	negocio_id: number;

	@Prop({ type: Object, default: {} })
	branding: any;
}

export const BusinessUiConfigSchema = SchemaFactory.createForClass(BusinessUiConfig);
