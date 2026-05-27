import { IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateBusinessUiDto {
	@IsNumber()
	negocio_id: number;

	@IsOptional()
	@IsObject()
	branding?: Record<string, unknown>;
}