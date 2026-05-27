import { IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
	@IsString()
	nombre_rol: string;

	@IsOptional()
	@IsString()
	descripcion?: string;
}