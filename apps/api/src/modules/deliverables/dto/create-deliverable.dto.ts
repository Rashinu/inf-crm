import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DeliverableStatus, DeliverableType } from '@inf-crm/types';

export class CreateDeliverableDto {
    @IsUUID()
    @IsNotEmpty()
    dealId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(DeliverableType)
    @IsNotEmpty()
    type: DeliverableType;

    @IsOptional()
    @IsEnum(DeliverableStatus)
    status?: DeliverableStatus;

    @IsOptional()
    @IsISO8601()
    dueDate?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
