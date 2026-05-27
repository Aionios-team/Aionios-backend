import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSupportTicketDto {
	@IsNumber()
	usuario_id: number;

	@IsString()
	asunto: string;

	@IsOptional()
	@IsArray()
	mensajes?: Record<string, unknown>[];

	@IsOptional()
	@IsString()
	estado?: string;
}