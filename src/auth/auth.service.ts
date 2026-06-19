import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { sanitizeUser, createTokenPayload } from '../common/utils/auth.utils';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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
    const token = this.jwtService.sign(createTokenPayload(user));
    return { user: sanitizeUser(user), token };
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
    const token = this.jwtService.sign(createTokenPayload(user));
    return { user: sanitizeUser(user), token };
  }
}
