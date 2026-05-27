import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { HorariosService } from './horarios.service';


@Controller('horarios')
export class HorariosController {
	constructor(private horariosService: HorariosService) {}

	@Post()
	create(@Body() body: any) {
		return this.horariosService.create(body);
	}

	@Get()
	findAll() {
		return this.horariosService.findAll();
	}

	@Get('negocio/:negocioId')
	findByNegocio(@Param('negocioId') negocioId: string) {
		return this.horariosService.findByNegocio(Number(negocioId));
	}

	@Post('negocio/:negocioId/bloqueo')
	addBloqueo(@Param('negocioId') negocioId: string, @Body() body: any) {
		return this.horariosService.addBloqueo(Number(negocioId), body);
	}

	@Delete('negocio/:negocioId/bloqueo/:index')
	removeBloqueo(@Param('negocioId') negocioId: string, @Param('index') index: string) {
		return this.horariosService.removeBloqueo(Number(negocioId), Number(index));
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.horariosService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() body: any) {
		return this.horariosService.update(id, body);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.horariosService.remove(id);
	}
}
