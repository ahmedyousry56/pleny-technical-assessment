import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class NearbyRestaurantsDto {
  @ApiProperty({ example: 29.9199, description: 'Longitude' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({ example: 31.2359, description: 'Latitude' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiPropertyOptional({
    example: 1000,
    description: 'Maximum distance in metres (default 1000 = 1 KM)',
    default: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxDistance?: number = 1000;
}
