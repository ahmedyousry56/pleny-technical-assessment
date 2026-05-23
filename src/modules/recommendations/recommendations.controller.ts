import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service.js';
import { RecommendationsResponseDto } from './dto/recommendations-response.dto.js';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly RecommendationsService: RecommendationsService,
  ) {}

  @Get(':userId')
  @ApiOperation({
    summary: 'Get restaurant recommendations for a user',
    description:
      'Finds users with shared cuisines and returns the restaurants they follow.',
  })
  @ApiParam({ name: 'userId', description: 'Target user ObjectId' })
  @ApiOkResponse({ description: 'Recommendations found', type: RecommendationsResponseDto })
  getRecommendations(@Param('userId') userId: string) {
    return this.RecommendationsService.getRecommendations(userId);
  }
}
