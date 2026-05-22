import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { ListRestaurantsDto } from './dto/list-restaurants.dto.js';
import { NearbyRestaurantsDto } from './dto/nearby-restaurants.dto.js';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated.js';
import { CreateRestaurantResponseDto, RestaurantResponseDto } from './dto/response-restaurants.dto.js';
import { MainService } from '../../shared/base/main.service.js';
import { PaginatedResponseDto } from '../../shared/dto/pagination.dto.js';

@Injectable()
export class RestaurantsService extends MainService {

  constructor(
    @InjectModel(Restaurant.name)
    private readonly RestaurantModel: Model<RestaurantDocument>,
    private readonly I18nService: I18nService<I18nTranslations>,
  ) {
    super()
  }

  async findAll<T = RestaurantResponseDto, Q extends ListRestaurantsDto = ListRestaurantsDto>(query: Q): Promise<PaginatedResponseDto<T>> {
    const { cuisine, page = 1, limit = 20 } = query;

    const filter: Record<string, any> = {};
    if (cuisine) {
      filter.cuisines = cuisine;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.RestaurantModel.find<T>(filter).skip(skip).limit(limit).exec(),
      this.RestaurantModel.countDocuments(filter).exec(),
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

  async create(dto: CreateRestaurantDto): Promise<CreateRestaurantResponseDto> {
    const existingRestaurant = await this.RestaurantModel.findOne({ slug: dto.slug }).exec();
    if (existingRestaurant) {
      throw new ConflictException(this.I18nService.t('restaurants.slug_exists', { args: { slug: dto.slug } }));
    }
    const restaurant = new this.RestaurantModel({
      name: dto.name,
      slug: dto.slug,
      cuisines: dto.cuisines,
      location: {
        type: 'Point',
        coordinates: [dto.location.longitude, dto.location.latitude],
      },
    });

    const savedRestaurant = await restaurant.save();
    if (!savedRestaurant) {
      throw new Error(this.I18nService.t('common.something_went_wrong'));
    }
    return {
      message: this.I18nService.t('restaurants.created_successfully'),
      _id: savedRestaurant._id.toString(),
    };
  }

  async findByIdOrSlug(idOrSlug: string): Promise<RestaurantDocument> {
    const isObjectId = Types.ObjectId.isValid(idOrSlug);

    const restaurant = isObjectId
      ? await this.RestaurantModel.findById(idOrSlug).exec()
      : await this.RestaurantModel.findOne({ slug: idOrSlug }).exec();

    if (!restaurant) {
      throw new NotFoundException(this.I18nService.t('restaurants.not_found', { args: { idOrSlug } }));
    }

    return restaurant;
  }


  async findNearby(query: NearbyRestaurantsDto) {
    const { longitude, latitude, maxDistance = 1000 } = query;

    const restaurants = await this.RestaurantModel
      .find({
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance
          },
        },
      })
      .exec();

    return {
      data: restaurants,
      meta: {
        total: restaurants.length,
        origin: { longitude, latitude },
        maxDistance,
      },
    };
  }
}
