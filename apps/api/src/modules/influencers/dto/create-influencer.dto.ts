import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, Min, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Platform } from '@inf-crm/types';
import { OutreachStatus } from '@prisma/client';

export class CreateInfluencerDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(Platform)
  @IsOptional()
  platform?: Platform;

  @IsString()
  @IsOptional()
  handle?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  followers?: number;

  @IsNumber()
  @IsOptional()
  engagementRate?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  pricePerPost?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  profileUrl?: string;

  @IsEnum(OutreachStatus)
  @IsOptional()
  outreachStatus?: OutreachStatus;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lastContactDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  nextFollowUpDate?: Date;

  @IsString()
  @IsOptional()
  outreachNotes?: string;
}
