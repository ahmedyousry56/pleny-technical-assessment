import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated.js';

export class FollowRestaurantDto {
  @ApiProperty({
    example: '664f1b2c3a4b5c6d7e8f9a0b',
    description: 'Restaurant ID to follow or unfollow',
  })
  @IsMongoId({ message: i18nValidationMessage<I18nTranslations>('users.restaurant_id_invalid') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('users.restaurant_id_required') })
  restaurantId: string;
}
