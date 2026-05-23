import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { BrandsService } from './brands.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
