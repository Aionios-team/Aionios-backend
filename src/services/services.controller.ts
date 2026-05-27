import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';


@Controller('services')
export class ServicesController {
	constructor(private servicesService: ServicesService) {}

	@Post()
	create(@Body() body: any) {
		return this.servicesService.create(body);
	}

	@Get()
	findAll() {
		return this.servicesService.findAll();
	}

	@Get('negocio/:negocioId')
	findByNegocio(@Param('negocioId') negocioId: string) {
		return this.servicesService.findByNegocio(Number(negocioId));
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.servicesService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() body: any) {
		return this.servicesService.update(id, body);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.servicesService.remove(id);
	}
}
