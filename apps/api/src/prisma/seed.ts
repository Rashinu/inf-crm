import { PrismaClient, PlanType, UserRole, DealStage, Platform, OutreachStatus, DeliverableType, DeliverableStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING SEEDING ---');

  // 1. Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'demo-tenant-id' },
    update: {},
    create: {
      id: 'demo-tenant-id',
      name: 'Listify AI Agency',
      planType: PlanType.PRO,
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  // 2. Create Demo User
  const passwordHash = await argon2.hash('demo123');
  const user = await prisma.user.upsert({
    where: { email: 'demo@listify.com' },
    update: {},
    create: {
      email: 'demo@listify.com',
      passwordHash,
      fullName: 'Murat Keskin (Demo)',
      role: UserRole.OWNER,
      tenantId: tenant.id,
    },
  });

  // 3. Create Brands
  console.log('Creating Brands...');
  const brandData = [
    { name: 'Trendyol', website: 'https://trendyol.com', notes: 'E-commerce partner' },
    { name: 'Getir', website: 'https://getir.com', notes: 'Fast delivery partner' },
  ];

  const brands: any[] = [];
  for (const b of brandData) {
    let brand = await prisma.brand.findFirst({ where: { name: b.name, tenantId: tenant.id } });
    if (!brand) {
      brand = await prisma.brand.create({
        data: { ...b, tenantId: tenant.id },
      });
    }
    brands.push(brand);
  }

  // 4. Create Influencers
  console.log('Creating Influencers...');
  const influencerData = [
    {
      name: 'Selin Yıldız',
      handle: 'selinyildiz',
      platform: Platform.INSTAGRAM,
      followers: 250000,
      engagementRate: 3.5,
      category: 'Fashion & LifeStyle',
      pricePerPost: 15000,
      outreachStatus: OutreachStatus.INTERESTED,
    },
    {
      name: 'Can Demir',
      handle: 'candemir_vlogs',
      platform: Platform.YOUTUBE,
      followers: 1200000,
      engagementRate: 5.2,
      category: 'Tech & Travel',
      pricePerPost: 45000,
      outreachStatus: OutreachStatus.DEAL_CREATED,
    },
  ];

  const influencers: any[] = [];
  for (const i of influencerData) {
    let influencer = await prisma.influencer.findFirst({ where: { handle: i.handle, tenantId: tenant.id } });
    if (!influencer) {
      influencer = await prisma.influencer.create({
        data: { ...i, tenantId: tenant.id },
      });
    }
    influencers.push(influencer);
  }

  // 5. Create Deals
  console.log('Creating Deals...');
  const dealCount = await prisma.deal.count({ where: { tenantId: tenant.id } });
  if (dealCount === 0) {
    await prisma.deal.create({
      data: {
        title: 'Trendyol Spring Campaign',
        brandId: (brands[0] as any).id,
        tenantId: tenant.id,
        stage: DealStage.APPROVED,
        totalAmount: 25000,
        platform: Platform.INSTAGRAM,
        influencerId: (influencers[0] as any).id,
        notes: '3 stories and 1 reel',
        deliverables: {
          create: [
            {
              type: DeliverableType.STORY,
              quantity: 3,
              status: DeliverableStatus.DONE,
              tenantId: tenant.id,
            },
            {
              type: DeliverableType.REELS,
              quantity: 1,
              status: DeliverableStatus.TODO,
              tenantId: tenant.id,
            },
          ],
        },
      },
    });
  }

  console.log('--- SEEDING COMPLETED ---');
  console.log(`Demo User: ${user.email}`);
  console.log('Password: demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
