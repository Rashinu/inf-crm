import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secret',
        });
    }

    async validate(payload: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: { tenant: true },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        // Return what will be attached to the request as `req.user`
        return {
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            tenantId: user.tenantId,
            role: user.role,
            tenantName: user.tenant.name,
        };
    }
}
