import { Controller, Post, Body, Get, Param, Patch, Delete, HttpCode, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Roles } from '../common/decorators/roles.decorator';


@Controller('reviews')
export class ReviewsController {
	constructor(private reviewsService: ReviewsService) {}

	@Post()
	create(@Body() body: any) {
		return this.reviewsService.create(body);
	}

	@Get()
	findAll() {
		return this.reviewsService.findAll();
	}

	@Get('mine')
	@Roles('cliente', 'administrador de negocio', 'super administrador')
	findMine(@Req() req: any) {
		return this.reviewsService.findByUsuario(req.user.sub);
	}

	@Get('negocio/:negocioId')
	findByNegocio(@Param('negocioId') negocioId: string) {
		return this.reviewsService.findByNegocio(Number(negocioId));
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.reviewsService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() body: any) {
		return this.reviewsService.update(id, body);
	}

	@Post(':id/respuesta')
	@HttpCode(200)
	addRespuesta(@Param('id') id: string, @Body('respuesta') respuesta: string) {
		return this.reviewsService.addRespuesta(id, respuesta);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.reviewsService.remove(id);
	}
}
