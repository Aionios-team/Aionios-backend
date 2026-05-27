import { Controller, Post, Body, Get, Param, Patch, Delete, Req } from '@nestjs/common';
import { Request } from 'express';
import { RequestsService } from './requests.service';
import { Roles } from '../common/decorators/roles.decorator';


@Controller('requests')
export class RequestsController {
	constructor(private requestsService: RequestsService) {}

	@Post()
	@Roles('cliente', 'administrador de negocio', 'staff del negocio', 'super administrador')
	create(@Body() body: any) {
		return this.requestsService.create(body);
	}

	@Get('mine')
	@Roles('cliente', 'administrador de negocio', 'staff del negocio', 'super administrador')
	findMine(@Req() req: Request & { user: { sub: number } }) {
		return this.requestsService.findByUsuario(req.user.sub);
	}

	@Get()
	@Roles('administrador de negocio', 'staff del negocio', 'super administrador')
	findAll() {
		return this.requestsService.findAll();
	}

	@Get('negocio/:negocioId')
	@Roles('administrador de negocio', 'staff del negocio', 'super administrador')
	findByNegocio(@Param('negocioId') negocioId: string) {
		return this.requestsService.findByNegocio(Number(negocioId));
	}

	@Get(':id')
	@Roles('administrador de negocio', 'staff del negocio', 'super administrador')
	findOne(@Param('id') id: string) {
		return this.requestsService.findOne(Number(id));
	}

	@Patch(':id')
	@Roles('administrador de negocio', 'staff del negocio', 'super administrador')
	update(@Param('id') id: string, @Body() body: any) {
		return this.requestsService.update(Number(id), body);
	}

	@Delete(':id')
	@Roles('administrador de negocio', 'staff del negocio', 'super administrador')
	remove(@Param('id') id: string) {
		return this.requestsService.remove(Number(id));
	}
}
