import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class BillingService implements OnModuleInit {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });
  }

  async getBillingStatus(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        billingStatus: true,
        trialEndsAt: true,
        stripeSubscriptionId: true,
      },
    });

    if (!tenant) throw new BadRequestException('Tenant not found');

    const now = new Date();
    const trialActive =
      tenant.billingStatus === 'TRIAL' &&
      tenant.trialEndsAt &&
      tenant.trialEndsAt > now;
    const daysLeft = tenant.trialEndsAt
      ? Math.max(
          0,
          Math.ceil(
            (tenant.trialEndsAt.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

    return {
      status: tenant.billingStatus,
      trialEndsAt: tenant.trialEndsAt,
      trialActive,
      daysLeft,
    };
  }

  async createCheckoutSession(
    tenantId: string,
    payload: { expectedUserCount: number; billingCycle: 'monthly' | 'yearly' },
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { users: { where: { role: 'OWNER' } } },
    });

    if (!tenant) throw new BadRequestException();

    const ownerUser = tenant.users[0];

    // Ensure stripe customer exists
    let customerId = tenant.stripeCustomerId;
    if (!customerId) {
      const tempCustomer = await this.stripe.customers.create({
        name: tenant.name,
        email: ownerUser?.email,
        metadata: { tenantId },
      });
      customerId = tempCustomer.id;
      await this.prisma.tenant.update({
        where: { id: tenantId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Calculate custom price based on inputs (like Resbox dynamic pricing)
    // E.g., base $29/mo, plus $5 per user over 1
    const basePrice = 2900; // $29.00
    const extraUserCount = Math.max(0, payload.expectedUserCount - 1);
    const userPrice = 500; // $5.00 per user

    let monthlyTotal = basePrice + extraUserCount * userPrice;
    let finalAmount =
      payload.billingCycle === 'yearly'
        ? monthlyTotal * 12 * 0.8
        : monthlyTotal; // 20% discount for yearly

    // Create line item
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_update: {
        address: 'auto',
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `ICM Dynamic Plan (${payload.expectedUserCount} Users) - ${payload.billingCycle}`,
            },
            recurring: {
              interval: payload.billingCycle === 'yearly' ? 'year' : 'month',
            },
            unit_amount: Math.round(finalAmount),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/billing`,
      client_reference_id: tenantId,
    });

    return { url: session.url };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) return;

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const tenantId = session.client_reference_id;
      const subscriptionId = session.subscription as string;

      if (tenantId) {
        await this.prisma.tenant.update({
          where: { id: tenantId },
          data: {
            billingStatus: 'ACTIVE',
            stripeSubscriptionId: subscriptionId,
          },
        });
      }
    } else if (event.type === 'customer.subscription.deleted') {
      // Subscription cancelled
      const subscription = event.data.object as Stripe.Subscription;
      const tenant = await this.prisma.tenant.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });
      if (tenant) {
        await this.prisma.tenant.update({
          where: { id: tenant.id },
          data: { billingStatus: 'CANCELLED' },
        });
      }
    }
  }
}
