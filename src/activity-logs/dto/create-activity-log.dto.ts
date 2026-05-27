import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsObject, IsString } from 'class-validator';

export class CreateActivityLogDto {
	@IsOptional()
	@IsNumber()
	usuario_id?: number;

	@IsString()
	accion: string;

	@IsOptional()
	@IsObject()
	metadata?: Record<string, unknown>;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	timestamp?: Date;
}