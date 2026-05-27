import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsNumber()
  id_cita?: number;

  @IsOptional()
  @IsNumber()
  monto?: number;

  @IsOptional()
  @IsString()
  metodo_pago?: string;

  @IsOptional()
  @IsString()
  transaccion_id?: string;

  @IsOptional()
  @IsIn(['PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO'])
  estado_pago?: 'PENDIENTE' | 'COMPLETADO' | 'FALLIDO' | 'REEMBOLSADO';
}
