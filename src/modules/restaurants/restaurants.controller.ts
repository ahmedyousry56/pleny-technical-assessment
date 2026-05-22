import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MainController } from '../../shared/base/main.controller.js';
import { ApiTags, ApiOperation, ApiParam, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { NearbyRestaurantsDto } from './dto/nearby-restaurants.dto.js';
import { ListRestaurantsDto } from './dto/list-restaurants.dto.js';
import {
  CreateRestaurantResponseDto,
  RestaurantResponseDto,
  NearbyRestaurantsResponseDto
} from './dto/response-restaurants.dto.js';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController extends MainController {
  constructor(
    private readonly RestaurantsService: RestaurantsService,
  ) {
    super(RestaurantsService);
  }

  @Get()
  @ApiOperation({ summary: 'List all items with pagination' })
  @ApiOkResponse({ description: 'Items found', type: ListRestaurantsDto })
  async index<T = RestaurantResponseDto, Q extends ListRestaurantsDto = ListRestaurantsDto>(@Query() query: Q) {
    query.page = query.page ? Number(query.page) : 1;
    query.limit = query.limit ? Number(query.limit) : 20;

    return this.Service.findAll<T>(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateRestaurantResponseDto,
  })
  create(@Body() dto: CreateRestaurantDto) {
    return this.RestaurantsService.create(dto);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby restaurants within a radius (default 1 KM)' })
  @ApiOkResponse({ description: 'Nearby restaurants found', type: NearbyRestaurantsResponseDto })
  findNearby(@Query() query: NearbyRestaurantsDto) {
    return this.RestaurantsService.findNearby(query);
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get restaurant details by ID or slug' })
  @ApiParam({ name: 'idOrSlug', description: 'Restaurant id or unique slug' })
  @ApiOkResponse({ description: 'Restaurant details', type: RestaurantResponseDto })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.RestaurantsService.findByIdOrSlug(idOrSlug);
  }
}
