import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { DealStage, Platform } from '@inf-crm/types';

export class CreateDealDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsUUID()
    @IsNotEmpty()
    brandId: string;

    @IsOptional()
    @IsUUID()
    contactId?: string;

    @IsNumber()
    @IsOptional()
    value?: number;

    @IsEnum(DealStage)
    @IsOptional()
    stage?: DealStage;

    @IsEnum(Platform)
    @IsNotEmpty()
    platform: Platform;

    @IsOptional()
    @IsString()
    description?: string;
}
