import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly RestaurantsService: RestaurantsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  create(@Body() dto: CreateRestaurantDto) {
    return this.RestaurantsService.create(dto);
  }
}
