import { BrandsEnum } from '@/enums/brands.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true, collection: 'brands' })
export class Brand {
  @Prop({
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
  })
  brandName: string;

  @Prop({
    type: Number,
    required: [true, 'Year founded is required'],
    min: [BrandsEnum.MIN_YEAR, 'Year founded seems too old'],
    max: [new Date().getFullYear(), 'Year founded cannot be in the future'],
    default: BrandsEnum.MIN_YEAR,
  })
  yearFounded: number;

  @Prop({
    type: String,
    required: [true, 'Headquarters location is required'],
    trim: true,
  })
  headquarters: string;

  @Prop({
    type: Number,
    required: [true, 'Number of locations is required'],
    min: [BrandsEnum.MIN_LOCATIONS, 'There should be at least one location'],
    default: BrandsEnum.MIN_LOCATIONS,
  })
  numberOfLocations: number;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
