import { Controller, Post, Body, Get, Param, Patch, Delete, Req } from '@nestjs/common';
import { BusinessService } from './business.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('business')
export class BusinessController {
	constructor(private businessService: BusinessService) {}

	@Post()
	@Roles('super administrador', 'administrador de negocio')
	create(@Body() body: any) {
		return this.businessService.create(body);
	}

	@Get()
	findAll() {
		return this.businessService.findAll();
	}

	@Get('mine')
	findMine(@Req() req: any) {
		return this.businessService.findByOwner(req.user.sub);
	}

	@Get('slug/:slug')
	findBySlug(@Param('slug') slug: string) {
		return this.businessService.findBySlug(slug);
	}

	@Get(':id')
	@Roles('cliente', 'super administrador', 'administrador de negocio', 'staff del negocio')
	findOne(@Param('id') id: string) {
		return this.businessService.findOne(Number(id));
	}

	@Patch(':id')
	@Roles('super administrador', 'administrador de negocio')
	update(@Param('id') id: string, @Body() body: any) {
		return this.businessService.update(Number(id), body);
	}

	@Delete(':id')
	@Roles('super administrador', 'administrador de negocio')
	remove(@Param('id') id: string) {
		return this.businessService.remove(Number(id));
	}

	@Post(':id/staff')
	@Roles('super administrador', 'administrador de negocio')
	assignStaff(@Param('id') id: string, @Body('usuarioId') usuarioId: number) {
		return this.businessService.assignStaff(Number(id), usuarioId);
	}

	@Delete(':id/staff')
	@Roles('super administrador', 'administrador de negocio')
	removeStaff(@Param('id') id: string, @Body('usuarioId') usuarioId: number) {
		return this.businessService.removeStaff(Number(id), usuarioId);
	}

	@Get(':id/staff')
	@Roles('super administrador', 'administrador de negocio')
	listStaff(@Param('id') id: string) {
		return this.businessService.listStaff(Number(id));
	}
}
