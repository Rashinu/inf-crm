import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('contacts')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    @Post()
    create(@TenantId() tenantId: string, @Body() createContactDto: CreateContactDto) {
        return this.contactsService.create(tenantId, createContactDto);
    }

    @Get()
    findAll(@TenantId() tenantId: string, @Query('brandId') brandId?: string) {
        return this.contactsService.findAll(tenantId, brandId);
    }

    @Get('leaderboard')
    getLeaderboard(@TenantId() tenantId: string) {
        return this.contactsService.getLeaderboard(tenantId);
    }

    @Get(':id')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.contactsService.findOne(tenantId, id);
    }

    @Patch(':id')
    update(
        @TenantId() tenantId: string,
        @Param('id') id: string,
        @Body() updateContactDto: UpdateContactDto,
    ) {
        return this.contactsService.update(tenantId, id, updateContactDto);
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.contactsService.remove(tenantId, id);
    }
}
