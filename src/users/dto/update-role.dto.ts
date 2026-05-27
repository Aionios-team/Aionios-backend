import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
	@IsOptional()
	@IsString()
	nombre_rol?: string;

	@IsOptional()
	@IsString()
	descripcion?: string;
}