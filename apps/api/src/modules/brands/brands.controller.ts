import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('brands')
@UseGuards(JwtAuthGuard, TenantGuard)
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) { }

    @Post()
    create(@TenantId() tenantId: string, @Body() createBrandDto: CreateBrandDto) {
        return this.brandsService.create(tenantId, createBrandDto);
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.brandsService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.brandsService.findOne(tenantId, id);
    }

    @Patch(':id')
    update(
        @TenantId() tenantId: string,
        @Param('id') id: string,
        @Body() updateBrandDto: UpdateBrandDto,
    ) {
        return this.brandsService.update(tenantId, id, updateBrandDto);
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.brandsService.remove(tenantId, id);
    }
}
