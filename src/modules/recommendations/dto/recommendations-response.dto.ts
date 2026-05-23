import { ApiProperty } from '@nestjs/swagger';
import { Cuisine } from '../../../enums/cuisine.enum.js';

class RecommendedUserDto {
  @ApiProperty({ example: '6a104b6883e89e55cef07fb6' })
  _id: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ enum: Cuisine, isArray: true, example: [Cuisine.BURGERS] })
  favoriteCuisines: Cuisine[];
}

class LocaleTextDto {
  @ApiProperty({ example: 'Restaurant Name' })
  en: string;

  @ApiProperty({ example: 'اسم المطعم' })
  ar: string;
}

class LocationDto {
  @ApiProperty({ example: 'Point' })
  type: string;

  @ApiProperty({ example: [29.9702, 31.1342], type: [Number], description: '[longitude, latitude]' })
  coordinates: number[];
}

class RecommendedRestaurantDto {
  @ApiProperty({ example: '6a104b6883e89e55cef07fb6' })
  _id: string;

  @ApiProperty({ type: LocaleTextDto })
  name: LocaleTextDto;

  @ApiProperty({ example: 'restaurant-slug' })
  slug: string;

  @ApiProperty({ enum: Cuisine, isArray: true, example: [Cuisine.BURGERS, Cuisine.PIZZA] })
  cuisines: Cuisine[];

  @ApiProperty({ type: LocationDto })
  location: LocationDto;
}

export class RecommendationsResponseDto {
  @ApiProperty({ type: [RecommendedUserDto] })
  users: RecommendedUserDto[];

  @ApiProperty({ type: [RecommendedRestaurantDto] })
  restaurants: RecommendedRestaurantDto[];
}
