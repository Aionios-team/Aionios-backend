import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { SupportTicketsService } from './support-tickets.service';


@Controller('support-tickets')
export class SupportTicketsController {
	constructor(private ticketsService: SupportTicketsService) {}

	@Post()
	create(@Body() body: any) {
		return this.ticketsService.create(body);
	}

	@Get()
	findAll() {
		return this.ticketsService.findAll();
	}

	@Get('user/:usuarioId')
	findByUser(@Param('usuarioId') usuarioId: string) {
		return this.ticketsService.findByUser(Number(usuarioId));
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() body: any) {
		return this.ticketsService.update(id, body);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.ticketsService.remove(id);
	}
}
