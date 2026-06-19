import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppLogDocument = AppLog & Document;

// TTL index: MongoDB elimina documentos automáticamente después de 90 días
@Schema({ collection: 'app_logs', timestamps: false })
export class AppLog {
  @Prop({ required: true })
  level!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({ type: Object, default: {} })
  meta!: Record<string, unknown>;

  // TTL index: 90 días = 7,776,000 segundos
  @Prop({ type: Date, default: Date.now, expires: 7_776_000 })
  timestamp!: Date;
}

export const AppLogSchema = SchemaFactory.createForClass(AppLog);
