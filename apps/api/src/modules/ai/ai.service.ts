import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (!apiKey) {
            console.warn('OPENAI_API_KEY is not defined. AI features might fail.');
        }
        this.openai = new OpenAI({ apiKey: apiKey || 'dummy-key-for-now' });
    }

    async analyzeContract(fileText: string) {
        if (!fileText) throw new BadRequestException('Provide raw text of contract to analyze');

        const prompt = `Analyze the following freelance contract and extract the key details in a rigid JSON format.
Make sure to extract:
- title: string
- brandName: string
- grossAmount: number
- currency: string
- platforms: array of strings (e.g. ["INSTAGRAM", "TIKTOK"])
- taxRate: number (e.g., 0.18 for 18%)
- paymentType: string (UPFRONT, MILESTONE, AFTER_DELIVERY)
- contractType: string (INFLUENCER or DEVELOPER)
- deadline: ISO string date

Contract Text:
"""
${fileText}
"""
JSON response ONLY:`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini', // or whatever affordable/capable model required
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' },
            });

            return JSON.parse(completion.choices[0].message.content || '{}');
        } catch (error) {
            console.error('AI Error:', error);
            throw new BadRequestException('Failed to analyze contract with AI');
        }
    }

    async draftEmail(context: string) {
        const prompt = `Draft a professional and polite email from a freelancer to a client or brand.
Here is the context/reason for the email:
${context}

Provide the email text cleanly without code blocks or markdown wrappers if possible.`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
            });

            return { emailDraft: completion.choices[0].message.content };
        } catch (error) {
            throw new BadRequestException('Failed to draft email');
        }
    }

    async generateHooks(topic: string, platform: string) {
        const prompt = `Create 3 highly engaging, viral-style hooks for a ${platform} post about: ${topic}.
Return ONLY a JSON format like { "hooks": ["hook1", "hook2", "hook3"] }.`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' },
            });

            const content = completion.choices[0].message.content;
            if (content) {
                const parsed = JSON.parse(content);
                return parsed.hooks || [];
            }
            return [];
        } catch (error) {
            throw new BadRequestException('Failed to generate hooks');
        }
    }
}
