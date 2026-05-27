import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSupportTicketDto {
	@IsOptional()
	@IsNumber()
	usuario_id?: number;

	@IsOptional()
	@IsString()
	asunto?: string;

	@IsOptional()
	@IsArray()
	mensajes?: Record<string, unknown>[];

	@IsOptional()
	@IsString()
	estado?: string;
}