import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('files')
@UseGuards(JwtAuthGuard, TenantGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('presign')
    getPresignedUrl(
        @Body('fileName') fileName: string,
        @Body('contentType') contentType: string,
    ) {
        return this.filesService.getPresignedUrl(fileName, contentType);
    }
}
