import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async create(data: any) {
		const { email, password, nombre, apellido, telefono, id_rol } = data;
		const exists = await this.prisma.usuario.findUnique({ where: { email } });
		if (exists) throw new BadRequestException('Email already registered');
		const hash = password ? await bcrypt.hash(password, 10) : undefined;
		return this.prisma.usuario.create({
			data: {
				email,
				password_hash: hash ?? '',
				nombre,
				apellido,
				telefono,
				id_rol: id_rol ?? 4,
			},
		});
	}

	async findAll() {
		return this.prisma.usuario.findMany();
	}

	async findOne(id: number) {
		const user = await this.prisma.usuario.findUnique({ where: { id } });
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	async update(id: number, data: any) {
		if (data.password) {
			data.password_hash = await bcrypt.hash(data.password, 10);
			delete data.password;
		}
		return this.prisma.usuario.update({ where: { id }, data });
	}

	async remove(id: number) {
		return this.prisma.usuario.delete({ where: { id } });
	}

	// Roles
	async createRole(data: any) {
		return this.prisma.rol.create({ data });
	}

	async findRoles() {
		return this.prisma.rol.findMany();
	}

	async findRole(id: number) {
		const role = await this.prisma.rol.findUnique({ where: { id } });
		if (!role) throw new NotFoundException('Role not found');
		return role;
	}

	async updateRole(id: number, data: any) {
		return this.prisma.rol.update({ where: { id }, data });
	}

	async removeRole(id: number) {
		return this.prisma.rol.delete({ where: { id } });
	}
}
