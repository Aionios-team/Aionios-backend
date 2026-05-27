import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

@Schema({ timestamps: true })
export class ActivityLog {
	@Prop()
	usuario_id: number;

	@Prop({ required: true })
	accion: string;

	@Prop({ type: Object, default: {} })
	metadata: any;

	@Prop()
	timestamp: Date;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

