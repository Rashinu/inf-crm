import { IsEnum, IsNotEmpty } from 'class-validator';
import { DealStage } from '@inf-crm/types';

export class UpdateDealStageDto {
    @IsEnum(DealStage)
    @IsNotEmpty()
    stage: DealStage;
}
