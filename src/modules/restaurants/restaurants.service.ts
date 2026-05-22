import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '../../generated/i18n.generated.js';
import { ICreateRestaurantResponse } from 'src/interfaces/restaurants.interface.js';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly RestaurantModel: Model<RestaurantDocument>,
    private readonly I18nService: I18nService<I18nTranslations>,
  ) {}

  async create(dto: CreateRestaurantDto): Promise<ICreateRestaurantResponse> {
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

}
