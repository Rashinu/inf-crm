import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
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

  @IsOptional()
  @IsUUID()
  salesRepId?: string;

  @IsOptional()
  @IsNumber()
  salesRepCommissionRate?: number;

  @IsOptional()
  @IsNumber()
  influencerCommissionRate?: number;

  @IsOptional()
  @IsUUID()
  influencerId?: string;

  @IsOptional()
  @IsNumber()
  reach?: number;

  @IsOptional()
  @IsNumber()
  engagement?: number;

  @IsOptional()
  @IsNumber()
  clicks?: number;

  @IsOptional()
  @IsNumber()
  roi?: number;
}
