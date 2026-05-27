import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';


@Controller('notifications')
export class NotificationsController {
	constructor(private notificationsService: NotificationsService) {}

	@Post()
	create(@Body() body: CreateNotificationDto) {
		return this.notificationsService.create(body);
	}

	@Get()
	findAll() {
		return this.notificationsService.findAll();
	}

	@Get('user/:usuarioId')
	findByUser(@Param('usuarioId') usuarioId: string) {
		return this.notificationsService.findByUser(Number(usuarioId));
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() body: UpdateNotificationDto) {
		return this.notificationsService.update(id, body);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.notificationsService.remove(id);
	}
}
