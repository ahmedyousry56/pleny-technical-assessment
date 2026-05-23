import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema.js';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated.js';
import { RecommendationsResponseDto } from './dto/recommendations-response.dto.js';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
    private readonly I18nService: I18nService<I18nTranslations>,
  ) {}

  async getRecommendations(userId: string): Promise<RecommendationsResponseDto> {
    const user = await this.UserModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(
        this.I18nService.t('users.not_found', {
          args: { id: userId },
        }),
      );
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: { $ne: new Types.ObjectId(userId) },
          favoriteCuisines: { $in: user.favoriteCuisines },
        },
      },
      {
        $lookup: {
          from: 'user_follows',
          localField: '_id',
          foreignField: 'user',
          as: 'follows',
        },
      },
      { $unwind: { path: '$follows', preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: null,
          users: {
            $addToSet: {
              _id: '$_id',
              fullName: '$fullName',
              favoriteCuisines: '$favoriteCuisines',
            },
          },
          restaurantIds: { $addToSet: '$follows.restaurant' },
        },
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantIds',
          foreignField: '_id',
          as: 'restaurants',
        },
      },
      {
        $project: {
          _id: 0,
          users: 1,
          restaurants: 1,
        },
      },
    ];

    const [result] = await this.UserModel.aggregate<RecommendationsResponseDto>(pipeline).exec();

    return result;
  }
}
