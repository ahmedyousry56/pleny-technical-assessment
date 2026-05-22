import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Cuisine } from '../../../enums/cuisine.enum.js';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto.js';

export class ListRestaurantsDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: Cuisine, description: 'Filter by cuisine type' })
  @IsOptional()
  @IsEnum(Cuisine)
  cuisine?: Cuisine;
}
