import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('analyze-contract')
    async analyzeContract(@Body('text') text: string) {
        return this.aiService.analyzeContract(text);
    }

    @Post('draft-email')
    async draftEmail(@Body('context') context: string) {
        return this.aiService.draftEmail(context);
    }

    @Post('generate-hooks')
    async generateHooks(
        @Body('topic') topic: string,
        @Body('platform') platform: string,
    ) {
        return this.aiService.generateHooks(topic, platform);
    }
}
