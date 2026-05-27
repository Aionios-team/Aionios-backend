import { IsNumber } from 'class-validator';

export class StaffAssignmentDto {
	@IsNumber()
	usuarioId: number;
}