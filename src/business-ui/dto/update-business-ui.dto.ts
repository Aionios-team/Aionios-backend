import { IsNumber, IsOptional, IsObject } from 'class-validator';

export class UpdateBusinessUiDto {
	@IsOptional()
	@IsNumber()
	negocio_id?: number;

	@IsOptional()
	@IsObject()
	branding?: Record<string, unknown>;
}