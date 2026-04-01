import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.error('[PRISMA] DATABASE_URL is not defined in environment!');
    } else {
      const maskedUrl = url.replace(/:([^:@]+)@/, ':****@');
      console.log(`[PRISMA] Connecting to database: ${maskedUrl}`);
    }
    
    try {
      await this.$connect();
      console.log('[PRISMA] Connected to database successfully.');
    } catch (error) {
      console.error('[PRISMA] Connection failed:', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
