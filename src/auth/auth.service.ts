import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private createTokenPayload(user: any) {
    return {
      sub: user.id,
      email: user.email,
      roleId: user.id_rol,
      role: user.rol?.nombre_rol ?? user.id_rol,
    };
  }

  private sanitizeUser(user: any) {
    if (!user) return user;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  async register(payload: any) {
    const { email, password, nombre, apellido, telefono, id_rol } = payload;
    const existing = await this.prisma.usuario.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email ya registrado');

    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.usuario.create({
      data: {
        email,
        password_hash: hash,
        nombre,
        apellido,
        telefono,
        id_rol: id_rol ?? 4,
      },
      include: { rol: true },
    });
    const token = this.jwtService.sign(this.createTokenPayload(user));
    return { user: this.sanitizeUser(user), token };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
      include: { rol: true },
    });
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return null;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const token = this.jwtService.sign(this.createTokenPayload(user));
    return { user: this.sanitizeUser(user), token };
  }
}
