import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class DiscoverDto {
  @IsString()
  niche: string;

  @IsString()
  @IsOptional()
  platform?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  count?: number;
}
