import { ApiProperty } from '@nestjs/swagger';
import { Cuisine } from '../../../enums/cuisine.enum.js';
import { PaginatedResponseDto } from '../../../shared/dto/pagination.dto.js';
import { RestaurantResponseDto } from '../../restaurants/dto/response-restaurants.dto.js';

export class UserResponseDto {
  @ApiProperty({ example: '6a104b6883e89e55cef07fb6' })
  _id: string;

  @ApiProperty({ example: 'Ahmed Yousry' })
  fullName: string;

  @ApiProperty({ enum: Cuisine, isArray: true, example: [Cuisine.BURGERS, Cuisine.PIZZA] })
  favoriteCuisines: Cuisine[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateUserResponseDto {
  @ApiProperty({ example: 'User created successfully' })
  message: string;

  @ApiProperty({ example: '6a104b6883e89e55cef07fb6' })
  _id: string;
}

export class PaginatedUsersResponseDto extends PaginatedResponseDto<UserResponseDto> {
  @ApiProperty({ type: [UserResponseDto] })
  declare data: UserResponseDto[];
}

export class FollowRestaurantResponseDto {
  @ApiProperty({ example: 'User followed restaurant successfully' })
  message: string;
}

export class UnfollowRestaurantResponseDto {
  @ApiProperty({ example: 'User unfollowed restaurant successfully' })
  message: string;
}

export class UserFollowingResponseDto {
  @ApiProperty({ example: '6a104b6883e89e55cef07fb6' })
  _id: string;

  @ApiProperty({ example: '6a104b6883e89e55cef07fb6' })
  user: string;

  @ApiProperty({ type: RestaurantResponseDto })
  restaurant: RestaurantResponseDto;
}
