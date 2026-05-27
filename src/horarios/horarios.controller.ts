import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';


@Controller('horarios')
export class HorariosController {
	constructor(private horariosService: HorariosService) {}

	@Post()
	create(@Body() body: CreateHorarioDto) {
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

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.horariosService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() body: UpdateHorarioDto) {
		return this.horariosService.update(id, body);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.horariosService.remove(id);
	}
}
