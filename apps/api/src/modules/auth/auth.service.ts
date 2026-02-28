import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const passwordHash = await argon2.hash(dto.password);

        // Create Tenant and Owner User in a transaction
        return this.prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    name: dto.workspaceName,
                },
            });

            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    passwordHash: passwordHash,
                    fullName: dto.fullName,
                    role: 'OWNER',
                    tenantId: tenant.id,
                },
            });

            const tokens = await this.generateTokens(user.id, tenant.id, user.role, tx);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                },
                tenant,
                ...tokens,
            };
        });
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user.id, user.tenantId, user.role);
        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
            ...tokens,
        };
    }

    async generateTokens(userId: string, tenantId: string, role: string, tx?: any) {
        const payload = { sub: userId, tenantId, role };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: '15m',
                secret: this.configService.get('JWT_SECRET'),
            }),
            this.jwtService.signAsync(payload, {
                expiresIn: '7d',
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            }),
        ]);

        const db = tx || this.prisma;
        // Save refresh token to user
        await db.user.update({
            where: { id: userId },
            data: { refreshToken }
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });

            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });

            if (!user || user.refreshToken !== refreshToken) {
                throw new UnauthorizedException('Invalid or expired refresh token');
            }

            return this.generateTokens(user.id, user.tenantId, user.role);
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async updateProfile(userId: string, tenantId: string, data: { email?: string; agencyName?: string; newPassword?: string; currentPassword?: string }) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, tenantId },
            include: { tenant: true },
        });

        if (!user) throw new UnauthorizedException();

        if (data.newPassword && data.currentPassword) {
            const isValid = await argon2.verify(user.passwordHash, data.currentPassword);
            if (!isValid) throw new UnauthorizedException('Invalid current password');

            const newHash = await argon2.hash(data.newPassword);
            await this.prisma.user.update({
                where: { id: userId },
                data: { passwordHash: newHash },
            });
        }

        if (data.email && data.email !== user.email) {
            const duplicate = await this.prisma.user.findUnique({ where: { email: data.email } });
            if (duplicate) throw new ConflictException('Email already in use');
            await this.prisma.user.update({
                where: { id: userId },
                data: { email: data.email },
            });
        }

        if (data.agencyName && data.agencyName !== user.tenant?.name) {
            await this.prisma.tenant.update({
                where: { id: tenantId },
                data: { name: data.agencyName },
            });
        }

        return { success: true };
    }
}
