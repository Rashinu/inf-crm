import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, DeliverableStatus } from '@inf-crm/types';
import { CurrencyService } from '../finance/currency.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private currencyService: CurrencyService,
  ) {}

  async getSummary(tenantId: string) {
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const deliverablesDueToday = await this.prisma.deliverable.count({
      where: {
        tenantId,
        dueDate: { gte: startOfToday, lte: endOfToday },
        status: { not: DeliverableStatus.DONE as any },
      },
    });

    const paymentsDueToday = await this.prisma.payment.count({
      where: {
        tenantId,
        dueDate: { gte: startOfToday, lte: endOfToday },
      },
    });

    const overduePaymentsResult = await this.prisma.payment.findMany({
      where: {
        tenantId,
        status: {
          in: [PaymentStatus.PENDING as any, PaymentStatus.PARTIAL as any],
        },
        dueDate: { lt: startOfToday },
      },
      include: { deal: true },
    });

    const overduePaymentsCount = overduePaymentsResult.length;
    let overduePaymentsAmount = 0;
    for (const p of overduePaymentsResult) {
      overduePaymentsAmount += await this.currencyService.convertToTRY(
        Number(p.amount),
        p.deal?.currency || 'TRY',
      );
    }

    const recentActivity = await this.prisma.activityLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { deal: { select: { title: true } } },
    });

    // Advanced Metrics (Patron Paneli)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // 1. Monthly Revenue (Payments PAID this month) // Using createdAt or updatedAt as proxy for when it was paid if we don't have paidAt
    const monthlyPayments = await this.prisma.payment.findMany({
      where: {
        tenantId,
        status: PaymentStatus.PAID as any,
        updatedAt: { gte: startOfMonth, lte: endOfMonth },
      },
      include: { deal: true },
    });

    let monthlyRevenue = 0;
    for (const p of monthlyPayments) {
      monthlyRevenue += await this.currencyService.convertToTRY(
        Number(p.amount),
        p.deal?.currency || 'TRY',
      );
    }

    // 2. Active Pipeline Value
    const activeDeals = await this.prisma.deal.findMany({
      where: {
        tenantId,
        stage: { notIn: ['COMPLETED', 'LOST', 'CANCELLED'] },
      },
    });
    let activePipelineValue = 0;
    for (const d of activeDeals) {
      activePipelineValue += await this.currencyService.convertToTRY(
        Number(d.totalAmount),
        d.currency,
      );
    }
    const activeDealsCount = activeDeals.length;

    // 3. Win Rate
    const totalClosedDeals = await this.prisma.deal.count({
      where: {
        tenantId,
        stage: { in: ['COMPLETED', 'LOST', 'CANCELLED'] },
      },
    });
    const wonDeals = await this.prisma.deal.count({
      where: {
        tenantId,
        stage: 'COMPLETED',
      },
    });
    const winRate =
      totalClosedDeals > 0
        ? Math.round((wonDeals / totalClosedDeals) * 100)
        : 0;

    // Outreach Metrics (Phase 5)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const newInfluencers = await (this.prisma.influencer as any).count({
      where: { tenantId, createdAt: { gte: startOfWeek } }
    });

    const contactedThisWeek = await (this.prisma.influencer as any).count({
      where: { tenantId, lastContactDate: { gte: startOfWeek } }
    });

    const repliesReceived = await (this.prisma.influencer as any).count({
      where: { tenantId, outreachStatus: 'REPLIED' }
    });

    const convertedToDeal = await (this.prisma.influencer as any).count({
      where: { tenantId, outreachStatus: 'DEAL_CREATED' }
    });

    return {
      todayTasks: {
        deliverablesDue: deliverablesDueToday,
        paymentsDue: paymentsDueToday,
      },
      overduePayments: {
        count: overduePaymentsCount,
        totalAmount: overduePaymentsAmount,
      },
      advanced: {
        monthlyRevenue,
        activePipelineValue,
        activeDealsCount,
        winRate,
      },
      outreachStats: {
        newInfluencers,
        contactedThisWeek,
        repliesReceived,
        convertedToDeal
      },
      recentActivity,
    };
  }

  async getAnalytics(tenantId: string) {
    const deals = await this.prisma.deal.findMany({
      where: { tenantId },
      include: {
        influencer: true,
      },
    });

    const platforms: Record<string, { total: number; won: number; spent: number }> = {};
    const categories: Record<string, number> = {};
    let totalSpent = 0;
    let totalPredictedROI = 0;
    const influencerStats: Record<string, any> = {};

    for (const deal of deals) {
      const platform = deal.influencer?.platform || 'Other';
      const category = deal.influencer?.category || 'General';

      if (!platforms[platform]) platforms[platform] = { total: 0, won: 0, spent: 0 };
      platforms[platform].total++;
      if (deal.stage === 'COMPLETED') platforms[platform].won++;

      const amount = await this.currencyService.convertToTRY(Number(deal.totalAmount), deal.currency);
      platforms[platform].spent += amount;
      totalSpent += amount;

      if (!categories[category]) categories[category] = 0;
      categories[category]++;

      // AI Simulation: ROI Prediction
      // If deal is completed, ROI is usually higher. We use followers and engagement as multipliers.
      const followers = Number(deal.influencer?.followers || 0);
      const engRate = Number(deal.influencer?.engagementRate || 0);
      
      // Rough predictive model: (Followers * EngRate / 100) * 0.1 conversion factor
      const predictedValue = (followers * (engRate / 100)) * 0.1 * (deal.stage === 'COMPLETED' ? 1.5 : 0.8);
      totalPredictedROI += predictedValue;
      
      // Track top influencers
      if (!influencerStats[deal.influencer?.id || 'unknown']) {
        influencerStats[deal.influencer?.id || 'unknown'] = {
          name: deal.influencer?.name || 'Unknown',
          platform: platform,
          spent: 0,
          deals: 0,
          roi: 0
        };
      }
      influencerStats[deal.influencer?.id || 'unknown'].spent += amount;
      influencerStats[deal.influencer?.id || 'unknown'].deals++;
      influencerStats[deal.influencer?.id || 'unknown'].roi += predictedValue;
    }

    // Convert to array and sort by ROI 
    const topInfluencers = Object.values(influencerStats)
      .filter(inf => inf.name !== 'Unknown')
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 10);

    return {
      platformStats: Object.entries(platforms).map(([name, stats]) => ({
        name,
        winRate: stats.total > 0 ? (stats.won / stats.total) * 100 : 0,
        spent: stats.spent,
      })),
      categoryDistribution: Object.entries(categories).map(([name, value]) => ({ name, value })),
      globalMetrics: {
        totalSpent,
        predictedROI: totalPredictedROI,
        roiFactor: totalSpent > 0 ? (totalPredictedROI / totalSpent) : 0,
      },
      topInfluencers,
    };
  }

  async getPipelineStats(tenantId: string) {
    const deals = await this.prisma.deal.groupBy({
      by: ['stage'],
      where: { tenantId },
      _count: { stage: true },
    });

    const pipelineMap: Record<string, number> = {};
    deals.forEach((d) => {
      pipelineMap[d.stage as string] = d._count.stage;
    });

    return pipelineMap;
  }
}
