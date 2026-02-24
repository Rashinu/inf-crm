import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('search')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get()
    async search(@TenantId() tenantId: string, @Query('q') query: string) {
        return this.searchService.globalSearch(tenantId, query);
    }
}
