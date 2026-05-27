import { Controller, Post, Body, Get, Param, Patch, Delete, Req, HttpCode } from '@nestjs/common';
import { SupportTicketsService } from './support-tickets.service';


@Controller('support-tickets')
export class SupportTicketsController {
	constructor(private ticketsService: SupportTicketsService) {}

	@Post()
	create(@Body() body: any, @Req() req: any) {
		return this.ticketsService.create({ ...body, usuario_id: body.usuario_id ?? req.user?.sub });
	}

	@Get()
	findAll() {
		return this.ticketsService.findAll();
	}

	@Get('mine')
	findMine(@Req() req: any) {
		return this.ticketsService.findByUser(req.user.sub);
	}

	@Get('user/:usuarioId')
	findByUser(@Param('usuarioId') usuarioId: string) {
		return this.ticketsService.findByUser(Number(usuarioId));
	}

	@Post(':id/mensaje')
	@HttpCode(200)
	addMensaje(@Param('id') id: string, @Body() body: any, @Req() req: any) {
		return this.ticketsService.addMensaje(id, {
			autor_id: req.user?.sub ?? body.autor_id,
			autor_nombre: body.autor_nombre,
			texto: body.texto,
		});
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
