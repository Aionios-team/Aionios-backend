import { Controller, Post, Body, Get, Param, Patch, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Patch('me')
	@Roles('cliente', 'administrador de negocio', 'staff del negocio', 'super administrador')
	updateMe(@Req() req: any, @Body() body: any) {
		const allowed = { nombre: body.nombre, apellido: body.apellido, telefono: body.telefono };
		return this.usersService.update(req.user.sub, allowed);
	}

	@Delete('me')
	@Roles('cliente', 'administrador de negocio', 'staff del negocio', 'super administrador')
	deleteMe(@Req() req: any) {
		return this.usersService.remove(req.user.sub);
	}

	@Post()
	@Roles('super administrador')
	create(@Body() body: any) {
		return this.usersService.create(body);
	}

	@Get()
	@Roles('super administrador')
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	@Roles('super administrador')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(Number(id));
	}

	@Patch(':id')
	@Roles('super administrador')
	update(@Param('id') id: string, @Body() body: any) {
		return this.usersService.update(Number(id), body);
	}

	@Delete(':id')
	@Roles('super administrador')
	remove(@Param('id') id: string) {
		return this.usersService.remove(Number(id));
	}

	// Roles endpoints
	@Post('roles')
	@Roles('super administrador')
	createRole(@Body() body: any) {
		return this.usersService.createRole(body);
	}

	@Get('roles')
	@Roles('super administrador')
	findRoles() {
		return this.usersService.findRoles();
	}

	@Get('roles/:id')
	@Roles('super administrador')
	findRole(@Param('id') id: string) {
		return this.usersService.findRole(Number(id));
	}

	@Patch('roles/:id')
	@Roles('super administrador')
	updateRole(@Param('id') id: string, @Body() body: any) {
		return this.usersService.updateRole(Number(id), body);
	}

	@Delete('roles/:id')
	@Roles('super administrador')
	removeRole(@Param('id') id: string) {
		return this.usersService.removeRole(Number(id));
	}
}
