import { Controller, Get, Param, Query, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('portal')
export class PortalController {
    constructor(private readonly brandsService: BrandsService) { }

    @Get('brands/:id')
    async getPortalData(
        @Param('id') id: string,
        @Query('key') key: string
    ) {
        if (!key) {
            throw new UnauthorizedException('Access key is required');
        }

        const data = await this.brandsService.getPortalData(id, key);
        if (!data) {
            throw new NotFoundException('Brand not found or invalid access key');
        }

        return data;
    }
}
