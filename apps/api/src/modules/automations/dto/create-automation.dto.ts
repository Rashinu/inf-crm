import { IsEnum, IsString, IsOptional, IsBoolean } from 'class-validator';
import { TriggerType, ActionType } from '@prisma/client';

export class CreateAutomationDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsEnum(TriggerType)
    triggerType: TriggerType;

    @IsOptional()
    triggerCondition?: any;

    @IsEnum(ActionType)
    actionType: ActionType;

    @IsOptional()
    actionPayload?: any;
}
