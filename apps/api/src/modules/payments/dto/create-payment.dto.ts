import { IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentStatus } from '@inf-crm/types';

export class CreatePaymentDto {
    @IsUUID()
    @IsNotEmpty()
    dealId: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsOptional()
    @IsEnum(PaymentStatus)
    status?: PaymentStatus;

    @IsISO8601()
    @IsNotEmpty()
    dueDate: string;

    @IsOptional()
    @IsISO8601()
    paidAt?: string;

    @IsOptional()
    @IsString()
    invoiceUrl?: string;
}
