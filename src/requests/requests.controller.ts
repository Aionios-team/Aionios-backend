import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';


@Controller('requests')
export class RequestsController {
	constructor(private requestsService: RequestsService) {}

	@Post()
	@Roles('cliente', 'administrador de negocio', 'staff del negocio', 'super administrador')
	create(@Body() body: CreateRequestDto) {
		return this.requestsService.create(body);
	}

	@Get()
	@Roles('administrador de negocio', 'staff del negocio', 'super administrador')
	findAll() {
		return this.requestsService.findAll();
	}

	@Get(':id')
	@Roles('administrador de negocio', 'staff del negocio', 'super administrador')
	findOne(@Param('id') id: string) {
		return this.requestsService.findOne(Number(id));
	}

	@Patch(':id')
	@Roles('administrador de negocio', 'staff del negocio', 'super administrador')
	update(@Param('id') id: string, @Body() body: UpdateRequestDto) {
		return this.requestsService.update(Number(id), body);
	}

	@Delete(':id')
	@Roles('administrador de negocio', 'staff del negocio', 'super administrador')
	remove(@Param('id') id: string) {
		return this.requestsService.remove(Number(id));
	}
}
