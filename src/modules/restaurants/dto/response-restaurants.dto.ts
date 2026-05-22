import { ApiProperty } from '@nestjs/swagger';
import { Cuisine } from '../../../enums/cuisine.enum.js';
import { PaginationMetaDto, PaginatedResponseDto } from '../../../shared/dto/pagination.dto.js';

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

export class RestaurantResponseDto {
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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateRestaurantResponseDto {
  @ApiProperty({ example: 'Restaurant created successfully' })
  message: string;

  @ApiProperty({ example: '60d5ecb8b392d70015345678' })
  _id: string;
}



export class PaginatedRestaurantsResponseDto extends PaginatedResponseDto<RestaurantResponseDto> {
  @ApiProperty({ type: [RestaurantResponseDto] })
  declare data: RestaurantResponseDto[];
}

class NearbyOriginDto {
  @ApiProperty({ example: 31.2357 })
  longitude: number;

  @ApiProperty({ example: 30.0444 })
  latitude: number;
}

class NearbyMetaDto {
  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ type: NearbyOriginDto })
  origin: NearbyOriginDto;

  @ApiProperty({ example: 1000 })
  maxDistance: number;
}

export class NearbyRestaurantsResponseDto {
  @ApiProperty({ type: [RestaurantResponseDto] })
  data: RestaurantResponseDto[];

  @ApiProperty({ type: NearbyMetaDto })
  meta: NearbyMetaDto;
}
