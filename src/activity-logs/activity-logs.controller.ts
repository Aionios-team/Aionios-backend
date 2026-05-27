import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';


@Controller('activity-logs')
export class ActivityLogsController {
	constructor(private activityLogsService: ActivityLogsService) {}

	@Post()
	create(@Body() body: CreateActivityLogDto) {
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
