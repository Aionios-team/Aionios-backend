import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRequestDto {
	@IsOptional()
	@IsNumber()
	id_usuario?: number;

	@IsOptional()
	@IsNumber()
	id_negocio?: number;

	@IsOptional()
	@IsString()
	id_servicio_nosql?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	fecha_hora_propuesta?: Date;

	@IsOptional()
	@IsEnum(['PENDIENTE', 'CONFIRMADA', 'CANCELADA'])
	estado?: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
}