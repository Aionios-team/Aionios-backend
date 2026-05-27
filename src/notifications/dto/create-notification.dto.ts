import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
	@IsNumber()
	usuario_id: number;

	@IsString()
	titulo: string;

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