import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { BusinessService } from './business.service';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { StaffAssignmentDto } from './dto/staff-assignment.dto';

@Controller('business')
export class BusinessController {
	constructor(private businessService: BusinessService) {}

	@Post()
	@Roles('super administrador', 'administrador de negocio')
	create(@Body() body: CreateBusinessDto) {
		return this.businessService.create(body);
	}

	@Get()
	@Roles('super administrador', 'administrador de negocio')
	findAll() {
		return this.businessService.findAll();
	}

	@Get(':id')
	@Roles('super administrador', 'administrador de negocio')
	findOne(@Param('id') id: string) {
		return this.businessService.findOne(Number(id));
	}

	@Patch(':id')
	@Roles('super administrador', 'administrador de negocio')
	update(@Param('id') id: string, @Body() body: UpdateBusinessDto) {
		return this.businessService.update(Number(id), body);
	}

	@Delete(':id')
	@Roles('super administrador', 'administrador de negocio')
	remove(@Param('id') id: string) {
		return this.businessService.remove(Number(id));
	}

	@Post(':id/staff')
	@Roles('super administrador', 'administrador de negocio')
	assignStaff(@Param('id') id: string, @Body() body: StaffAssignmentDto) {
		return this.businessService.assignStaff(Number(id), body.usuarioId);
	}

	@Delete(':id/staff')
	@Roles('super administrador', 'administrador de negocio')
	removeStaff(@Param('id') id: string, @Body() body: StaffAssignmentDto) {
		return this.businessService.removeStaff(Number(id), body.usuarioId);
	}

	@Get(':id/staff')
	@Roles('super administrador', 'administrador de negocio')
	listStaff(@Param('id') id: string) {
		return this.businessService.listStaff(Number(id));
	}
}
