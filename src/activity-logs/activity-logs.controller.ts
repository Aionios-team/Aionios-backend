import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';


@Controller('activity-logs')
export class ActivityLogsController {
	constructor(private activityLogsService: ActivityLogsService) {}

	@Post()
	create(@Body() body: any) {
		return this.activityLogsService.create(body);
	}

	@Get()
	findAll() {
		return this.activityLogsService.findAll();
	}

	@Get('user/:usuarioId')
	findByUser(@Param('usuarioId') usuarioId: string) {
		return this.activityLogsService.findByUser(Number(usuarioId));
	}
}
