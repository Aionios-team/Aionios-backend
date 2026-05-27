import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBusinessDto {
	@IsOptional()
	@IsNumber()
	id_dueno?: number;

	@IsOptional()
	@IsString()
	nombre?: string;

	@IsOptional()
	@IsString()
	slug?: string;

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