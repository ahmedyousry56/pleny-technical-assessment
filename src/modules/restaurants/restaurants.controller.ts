import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
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

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get restaurant details by ID or slug' })
  @ApiParam({ name: 'idOrSlug', description: 'Restaurant id or unique slug' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.RestaurantsService.findByIdOrSlug(idOrSlug);
  }
}
