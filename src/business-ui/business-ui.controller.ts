import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { BusinessUiService } from './business-ui.service';
import { CreateBusinessUiDto } from './dto/create-business-ui.dto';
import { UpdateBusinessUiDto } from './dto/update-business-ui.dto';


@Controller('business-ui')
export class BusinessUiController {
	constructor(private uiService: BusinessUiService) {}

	@Post()
	create(@Body() body: CreateBusinessUiDto) {
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
	update(@Param('id') id: string, @Body() body: UpdateBusinessUiDto) {
		return this.uiService.update(id, body);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.uiService.remove(id);
	}
}
