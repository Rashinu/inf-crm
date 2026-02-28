import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { PortalController } from './portal.controller';

@Module({
  providers: [BrandsService],
  controllers: [BrandsController, PortalController]
})
export class BrandsModule { }
