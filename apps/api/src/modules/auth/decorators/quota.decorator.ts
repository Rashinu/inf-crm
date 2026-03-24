import { SetMetadata } from '@nestjs/common';

export const Quota = (type: 'influencer' | 'campaign') => SetMetadata('quotaType', type);
