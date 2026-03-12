import { Controller, Get, Post, Body, Req, Headers } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('status')
  getBillingStatus(@Req() req) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.billingService.getBillingStatus(tenantId);
  }

  @Post('checkout')
  createCheckoutSession(
    @Req() req,
    @Body()
    body: { plan: 'starter' | 'pro' | 'premium'; billingCycle?: 'monthly' | 'yearly' },
  ) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    return this.billingService.createCheckoutSession(tenantId, body);
  }

  @Post('webhook')
  handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!req.rawBody) throw new Error('Raw body required for webhook');
    return this.billingService.handleWebhook(signature, req.rawBody);
  }
}
