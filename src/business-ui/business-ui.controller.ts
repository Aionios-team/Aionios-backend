import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { BusinessUiService } from './business-ui.service';


@Controller('business-ui')
export class BusinessUiController {
	constructor(private uiService: BusinessUiService) {}

	@Post()
	create(@Body() body: any) {
		return this.uiService.create(body);
	}

	@Get()
	findAll() {
		return this.uiService.findAll();
	}

	@Get('negocio/:negocioId')
	findByNegocio(@Param('negocioId') negocioId: string) {
		return this.uiService.findByNegocio(Number(negocioId));
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() body: any) {
		return this.uiService.update(id, body);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.uiService.remove(id);
	}
}
