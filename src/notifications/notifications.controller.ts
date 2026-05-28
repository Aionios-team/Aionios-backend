import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('notifications')
export class NotificationsController {
	constructor(private notificationsService: NotificationsService) {}

	@Post()
	@Roles('cliente', 'administrador de negocio', 'staff del negocio', 'super administrador')
	create(@Body() body: any) {
		return this.notificationsService.create(body);
	}

	@Get()
	@Roles('super administrador')
	findAll() {
		return this.notificationsService.findAll();
	}

	@Get('user/:usuarioId')
	@Roles('cliente', 'administrador de negocio', 'staff del negocio', 'super administrador')
	findByUser(
		@Param('usuarioId') usuarioId: string,
		@Query('limit') limit?: string,
	) {
		return this.notificationsService.findByUser(Number(usuarioId), limit ? Number(limit) : 10);
	}

	@Delete('user/:usuarioId/legacy')
	@Roles('cliente', 'administrador de negocio', 'staff del negocio', 'super administrador')
	removeLegacy(@Param('usuarioId') usuarioId: string) {
		return this.notificationsService.removeLegacyByUser(Number(usuarioId));
	}

	@Patch(':id')
	@Roles('cliente', 'administrador de negocio', 'staff del negocio', 'super administrador')
	update(@Param('id') id: string, @Body() body: any) {
		return this.notificationsService.update(id, body);
	}

	@Delete(':id')
	@Roles('cliente', 'administrador de negocio', 'staff del negocio', 'super administrador')
	remove(@Param('id') id: string) {
		return this.notificationsService.remove(id);
	}
}
