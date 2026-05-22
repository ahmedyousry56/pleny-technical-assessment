import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema.js';
import { UserFollow, UserFollowDocument } from './schemas/user-follow.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { FollowRestaurantDto } from './dto/follow-restaurant.dto.js';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated.js';
import { MainService } from '../../shared/base/main.service.js';
import { PaginationQueryDto, PaginatedResponseDto } from '../../shared/dto/pagination.dto.js';
import { 
  CreateUserResponseDto, 
  UserResponseDto, 
  FollowRestaurantResponseDto, 
  UnfollowRestaurantResponseDto, 
  UserFollowingResponseDto 
} from './dto/response-users.dto.js';

@Injectable()
export class UsersService extends MainService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
    @InjectModel(UserFollow.name)
    private readonly UserFollowModel: Model<UserFollowDocument>,
    private readonly I18nService: I18nService<I18nTranslations>,
  ) {
    super();
  }

  async findAll<T = UserResponseDto, Q extends PaginationQueryDto = PaginationQueryDto>(query: Q): Promise<PaginatedResponseDto<T>> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.UserModel.find<T>().skip(skip).limit(limit).exec(),
      this.UserModel.countDocuments().exec(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = await this.UserModel.create(dto);
    return {
      message: this.I18nService.t('users.created_successfully'),
      _id: user._id.toString(),
    };
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.UserModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(this.I18nService.t('users.not_found', { args: { id } }));
    }
    return user;
  }

  async followRestaurant(
    userId: string,
    dto: FollowRestaurantDto,
  ): Promise<FollowRestaurantResponseDto> {
    await this.ensureUserExists(userId);

    const exists = await this.UserFollowModel.exists({
      user: new Types.ObjectId(userId),
      restaurant: new Types.ObjectId(dto.restaurantId),
    });

    if (exists) {
      throw new ConflictException(this.I18nService.t('users.already_following'));
    }

    const follow = await this.UserFollowModel.create({
      user: new Types.ObjectId(userId),
      restaurant: new Types.ObjectId(dto.restaurantId),
    });

    if (!follow) {
      throw new InternalServerErrorException(this.I18nService.t('users.follow_failed'));
    }

    return {
      message: this.I18nService.t('users.followed_successfully'),
    };
  }

  async unfollowRestaurant(
    userId: string,
    dto: FollowRestaurantDto,
  ): Promise<UnfollowRestaurantResponseDto> {
    const result = await this.UserFollowModel
      .deleteOne({
        user: new Types.ObjectId(userId),
        restaurant: new Types.ObjectId(dto.restaurantId),
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(this.I18nService.t('users.follow_not_found'));
    }

    return { message: this.I18nService.t('users.unfollowed_successfully') };
  }

  async getFollowedRestaurants(userId: string): Promise<UserFollowingResponseDto[]> {
    await this.ensureUserExists(userId);

    const following = await this.UserFollowModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('restaurant')
      .exec();
      
    return following as unknown as UserFollowingResponseDto[];
  }

  private async ensureUserExists(userId: string): Promise<void> {
    const exists = await this.UserModel.exists({
      _id: new Types.ObjectId(userId),
    });
    if (!exists) {
      throw new NotFoundException(this.I18nService.t('users.not_found', { args: { id: userId } }));
    }
  }
}
