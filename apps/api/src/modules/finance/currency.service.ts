import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CurrencyService {
    private rates: Record<string, number> = {
        'TRY': 1,
        'USD': 35.0,  // Defaults if fetch fails
        'EUR': 38.0,
        'GBP': 45.0
    };
    private lastFetch: Date | null = null;
    private readonly logger = new Logger(CurrencyService.name);

    async getRates(): Promise<Record<string, number>> {
        const now = new Date();
        // Cache rates for 6 hours
        if (this.lastFetch && (now.getTime() - this.lastFetch.getTime()) < 6 * 60 * 60 * 1000) {
            return this.rates;
        }

        try {
            const response = await fetch('https://open.er-api.com/v6/latest/TRY');
            const data = await response.json();

            if (data && data.rates) {
                this.rates['TRY'] = 1;
                this.rates['USD'] = 1 / data.rates['USD'];
                this.rates['EUR'] = 1 / data.rates['EUR'];
                this.rates['GBP'] = 1 / data.rates['GBP'];
                this.lastFetch = now;
                this.logger.log('Currency exchange rates successfully updated from API.');
            }
        } catch (error) {
            this.logger.error('Failed to fetch real-time currency rates. Falling back to static defaults.', error);
        }

        return this.rates;
    }

    async convertToTRY(amount: number, fromCurrency?: string): Promise<number> {
        if (!amount) return 0;
        if (!fromCurrency || fromCurrency === 'TRY') return Number(amount);

        const currentRates = await this.getRates();
        const rate = currentRates[fromCurrency];

        if (rate) {
            return Number(amount) * rate;
        }

        // If unknown currency, assume 1:1 or handle gracefully
        return Number(amount);
    }
}
