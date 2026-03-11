import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getStats() {
        const totalUsers = await this.prisma.user.count();
        const totalTenants = await this.prisma.tenant.count();
        const activeDeals = await this.prisma.deal.count({
            where: { stage: { notIn: ['LOST', 'DELAYED', 'CANCELLED', 'COMPLETED'] } }
        });

        return {
            totalUsers,
            totalTenants,
            activeDeals,
            mrr: 24500, // Demo value based on frontend mockup
            systemLoad: 14 // Demo value
        };
    }

    async getRecentLogins() {
        const sessions = await this.prisma.userSession.findMany({
            take: 50,
            orderBy: { loginAt: 'desc' },
            include: {
                user: { select: { fullName: true, email: true } },
                tenant: { select: { name: true } }
            }
        });

        return sessions.map(s => ({
            id: s.id,
            user: s.user?.fullName || s.user?.email || 'Unknown',
            tenant: s.tenant?.name || 'Unknown',
            ip: s.ipAddress,
            os: s.userAgent,
            time: s.loginAt,
            status: 'success'
        }));
    }
}
