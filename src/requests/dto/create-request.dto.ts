import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
	@IsNumber()
	id_usuario: number;

	@IsNumber()
	id_negocio: number;

	@IsString()
	id_servicio_nosql: string;

	@Type(() => Date)
	@IsDate()
	fecha_hora_propuesta: Date;

	@IsOptional()
	@IsEnum(['PENDIENTE', 'CONFIRMADA', 'CANCELADA'])
	estado?: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
}