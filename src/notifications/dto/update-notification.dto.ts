import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
	@IsOptional()
	@IsNumber()
	usuario_id?: number;

	@IsOptional()
	@IsString()
	titulo?: string;

	@IsOptional()
	@IsString()
	mensaje?: string;

	@IsOptional()
	@IsBoolean()
	leido?: boolean;

	@IsOptional()
	@IsIn(['recordatorio_cita', 'pago_exitoso', 'cancelacion'])
	tipo?: 'recordatorio_cita' | 'pago_exitoso' | 'cancelacion';
}