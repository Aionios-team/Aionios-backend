import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Post()
	@Roles('super administrador')
	create(@Body() body: CreateUserDto) {
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
	update(@Param('id') id: string, @Body() body: UpdateUserDto) {
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
	createRole(@Body() body: CreateRoleDto) {
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
	updateRole(@Param('id') id: string, @Body() body: UpdateRoleDto) {
		return this.usersService.updateRole(Number(id), body);
	}

	@Delete('roles/:id')
	@Roles('super administrador')
	removeRole(@Param('id') id: string) {
		return this.usersService.removeRole(Number(id));
	}
}
