import { IsArray, IsNumber, IsOptional, IsObject } from 'class-validator';

export class UpdateHorarioDto {
	@IsOptional()
	@IsNumber()
	negocio_id?: number;

	@IsOptional()
	@IsObject()
	configuracion_semanal?: Record<string, unknown>;

	@IsOptional()
	@IsArray()
	excepciones_y_festivos?: Record<string, unknown>[];
}