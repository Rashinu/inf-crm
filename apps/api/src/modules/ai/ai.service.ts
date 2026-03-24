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
    if (!fileText)
      throw new BadRequestException('Provide raw text of contract to analyze');

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

  async searchInfluencers(niche: string, platform?: string, count: number = 5) {
    const prompt = `Act as an influencer marketing expert. Generate ${count} realistic (but fictional) influencer profiles for the niche: "${niche}" ${platform ? `on ${platform}` : ''}.
    
    Return ONLY a JSON array of objects with these fields:
    - name: string (Full Name)
    - handle: string (starting with @)
    - bio: string (short catchy bio)
    - platform: string (INSTAGRAM, TIKTOK, YOUTUBE, or TWITTER)
    - followers: number
    - engagementRate: number (e.g. 4.5)
    - category: string
    - location: string (City, Country)
    - pricePerPost: number (estimated in TRY)
    
    JSON array ONLY:`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;
      if (content) {
        const parsed = JSON.parse(content);
        // Sometimes GPT returns { "influencers": [...] } or just [...]
        return parsed.influencers || (Array.isArray(parsed) ? parsed : Object.values(parsed)[0]);
      }
      return [];
    } catch (error) {
      console.error('AI Discovery Error:', error);
      throw new BadRequestException('Failed to discover influencers via AI');
    }
  }

  async generateOutreachEmail(profile: any, brandInfo: string) {
    const prompt = `Act as an expert influencer outreach manager. Draft a high-conversion, personalized cold email to the following influencer:
    Influencer Name: ${profile.name}
    Influencer Bio/Niche: ${profile.bio || profile.category}
    Platform: ${profile.platform}
    
    The email is from the brand/workspace: "${brandInfo}".
    
    Requirements:
    - Subject line should be catchy and professional.
    - Mention their content style based on their niche.
    - Propose a collaboration.
    - Keep it under 150 words.
    - Use a friendly but professional tone.
    - Return ONLY a JSON object with { "subject": "...", "body": "..." }.
    
    JSON ONLY:`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI Outreach Error:', error);
      throw new BadRequestException('Failed to generate outreach email via AI');
    }
  }

  async generateOutreachVariations(data: { influencerName: string; niche: string; platform: string; brandName: string; offerType: string }) {
    const prompt = `Act as an expert outreach specialist. You need to write outreach messages to an influencer.
    Here is the context:
    - Influencer Name: ${data.influencerName}
    - Niche: ${data.niche}
    - Platform: ${data.platform}
    - Brand Name: ${data.brandName}
    - Offer Type: ${data.offerType}

    Return ONLY a JSON object with the following keys exactly:
    - shortDm: A very short, punchy direct message suitable for Instagram/TikTok DM.
    - emailVersion: A professional email version with a Subject Line.
    - casualTone: A super friendly, casual, and energetic message version.
    - professionalTone: A highly professional, corporate style pitch.

    Do not include any other keys or markdown wrappers. Just the JSON object.
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI Extra Outreach Error:', error);
      throw new BadRequestException('Failed to generate outreach variations via AI');
    }
  }
}
