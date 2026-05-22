import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsEnum,
} from 'class-validator';
import { Cuisine } from '../../../enums/cuisine.enum.js';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated.js';

export class CreateUserDto {
  @ApiProperty({ example: 'Ahmed Yousry', description: 'User full name' })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('users.name_string') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('users.name_required') })
  fullName: string;

  @ApiProperty({
    enum: Cuisine,
    isArray: true,
    example: [Cuisine.BURGERS, Cuisine.PIZZA],
    description: 'User favorite cuisine types',
  })
  @IsArray()
  @ArrayMinSize(1, { message: i18nValidationMessage<I18nTranslations>('users.cuisines_min') })
  @IsEnum(Cuisine, { each: true, message: i18nValidationMessage<I18nTranslations>('users.cuisine_invalid', { cuisines: Object.values(Cuisine).join(', ') }) })
  favoriteCuisines: Cuisine[];
}
