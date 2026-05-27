import { IsArray, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateHorarioDto {
	@IsNumber()
	negocio_id: number;

	@IsOptional()
	@IsObject()
	configuracion_semanal?: Record<string, unknown>;

	@IsOptional()
	@IsArray()
	excepciones_y_festivos?: Record<string, unknown>[];
}