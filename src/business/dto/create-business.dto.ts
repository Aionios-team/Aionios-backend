import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBusinessDto {
	@IsNumber()
	id_dueno: number;

	@IsString()
	nombre: string;

	@IsString()
	slug: string;

	@IsOptional()
	@IsString()
	descripcion?: string;

	@IsOptional()
	@IsString()
	direccion?: string;

	@IsOptional()
	@IsString()
	telefono_comercial?: string;
}