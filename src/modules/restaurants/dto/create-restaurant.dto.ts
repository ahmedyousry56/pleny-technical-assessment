import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsEnum,
  IsNumber,
  IsOptional,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Cuisine } from '../../../enums/cuisine.enum.js';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../generated/i18n.generated.js';

class LocaleNameDto {
  @ApiProperty({ example: 'Qasr El Kababgi', description: 'Restaurant name in English' })
  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('restaurants.name_required') })
  en: string;

  @ApiProperty({ example: 'قصر الكبابجي', description: 'Restaurant name in Arabic' })
  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('restaurants.name_required') })
  ar: string;
}

class LocationDto {
  @ApiProperty({ example: 29.9192, description: 'Longitude coordinate' })
  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({ example: 31.2357, description: 'Latitude coordinate' })
  @IsNumber({ allowNaN: false })
  @IsNotEmpty()
  latitude: number;
}

export class CreateRestaurantDto {
  @ApiProperty({ type: LocaleNameDto, description: 'Restaurant localized name in English and Arabic' })
  @ValidateNested({ message: i18nValidationMessage<I18nTranslations>('restaurants.name_required') })
  @Type(() => LocaleNameDto)
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('restaurants.name_required') })
  name: LocaleNameDto;

  @ApiProperty({ example: 'qasr-el-kababgi', description: 'Unique slug' })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('restaurants.slug_required') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('restaurants.slug_required') })
  slug: string;

  @ApiProperty({
    enum: Cuisine,
    isArray: true,
    example: [Cuisine.BURGERS, Cuisine.FRIED],
    description: 'Between 1 and 3 cuisines',
  })
  @IsArray()
  @ArrayMinSize(1, { message: i18nValidationMessage<I18nTranslations>('restaurants.cuisines_min') })
  @ArrayMaxSize(3, { message: i18nValidationMessage<I18nTranslations>('restaurants.cuisines_max') })
  @IsEnum(Cuisine, { each: true, message: i18nValidationMessage<I18nTranslations>('restaurants.cuisine_invalid', {cuisines: Object.values(Cuisine).join(', ')}) })
  cuisines: Cuisine[];

  @ApiProperty({ type: LocationDto, description: 'Restaurant geographic location' })
  @ValidateNested({ message: i18nValidationMessage<I18nTranslations>('restaurants.location_required') })
  @Type(() => LocationDto)
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('restaurants.location_required') })
  location: LocationDto;
}
