import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateContactDto {
    @IsUUID()
    @IsNotEmpty()
    brandId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    position?: string;
}
