import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.active) throw new UnauthorizedException('Credenciais invalidas');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Credenciais invalidas');
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return { access_token: token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async createUser(dto: any) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email ja cadastrado');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({ data: { name: dto.name, email: dto.email, password: hash, role: dto.role || 'ANALYST' } });
    const { password: _, ...result } = user;
    return result;
  }

  async listUsers() {
    return this.prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, active: true, createdAt: true } });
  }
}
