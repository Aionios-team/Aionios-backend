import { IsIn, IsNumber, IsOptional, IsObject, IsString } from 'class-validator';

export class CreateServiceDto {
	@IsNumber()
	negocio_id: number;

	@IsString()
	nombre: string;

	@IsOptional()
	@IsString()
	descripcion?: string;

	@IsOptional()
	@IsIn(['tiempo_fijo', 'por_hora', 'cotizacion_requerida'])
	tipo_cobro?: 'tiempo_fijo' | 'por_hora' | 'cotizacion_requerida';

	@IsOptional()
	@IsNumber()
	precio_base?: number;

	@IsOptional()
	@IsNumber()
	duracion_minutos?: number;

	@IsOptional()
	@IsObject()
	campos_adicionales?: Record<string, unknown>;
}