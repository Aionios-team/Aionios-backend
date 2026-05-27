import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
	@IsNumber()
	negocio_id: number;

	@IsNumber()
	usuario_id: number;

	@IsNumber()
	@Min(1)
	@Max(5)
	rating: number;

	@IsOptional()
	@IsString()
	comentario?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	fecha?: Date;
}