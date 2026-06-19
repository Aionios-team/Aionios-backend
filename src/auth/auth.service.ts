import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { sanitizeUser, createTokenPayload } from '../common/utils/auth.utils';

const REFRESH_TOKEN_EXPIRES_DAYS = 7;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  private async createRefreshToken(userId: number): Promise<string> {
    const token = this.generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

    await this.prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    });

    return token;
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

    const accessToken = this.jwtService.sign(createTokenPayload(user));
    const refreshToken = await this.createRefreshToken(user.id);

    return { user: sanitizeUser(user), token: accessToken, refreshToken };
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

    const accessToken = this.jwtService.sign(createTokenPayload(user));
    const refreshToken = await this.createRefreshToken(user.id);

    return { user: sanitizeUser(user), token: accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { usuario: { include: { rol: true } } },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    // Revocar token viejo (rotación)
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    const newAccessToken = this.jwtService.sign(
      createTokenPayload(stored.usuario),
    );
    const newRefreshToken = await this.createRefreshToken(stored.userId);

    return { token: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken, revoked: false },
      data: { revoked: true },
    });
  }
}
