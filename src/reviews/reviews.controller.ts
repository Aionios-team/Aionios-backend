import { Controller, Post, Body, Get, Param, Patch, Delete, HttpCode } from '@nestjs/common';
import { ReviewsService } from './reviews.service';


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
