import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service.js';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly RestaurantsService: RestaurantsService,
  ) {}
}
