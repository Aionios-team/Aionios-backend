import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	@MinLength(6)
	password?: string;

	@IsOptional()
	@IsString()
	nombre?: string;

	@IsOptional()
	@IsString()
	apellido?: string;

	@IsOptional()
	@IsString()
	telefono?: string;

	@IsOptional()
	@IsNumber()
	id_rol?: number;
}