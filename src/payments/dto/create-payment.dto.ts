import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  id_cita: number;

  @IsNumber()
  monto: number;

  @IsString()
  metodo_pago: string;

  @IsOptional()
  @IsString()
  transaccion_id?: string;

  @IsOptional()
  @IsIn(['PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO'])
  estado_pago?: 'PENDIENTE' | 'COMPLETADO' | 'FALLIDO' | 'REEMBOLSADO';
}
