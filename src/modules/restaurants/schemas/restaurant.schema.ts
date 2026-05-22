import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Cuisine } from '../../../enums/cuisine.enum';

export type RestaurantDocument = Restaurant & Document;

@Schema({ _id: false })
class LocaleText {
    @Prop({ required: false, trim: true, default: null })
    en: string;

    @Prop({ required: false, trim: true, default: null })
    ar: string;
}

const LocaleTextSchema = SchemaFactory.createForClass(LocaleText);

@Schema({ timestamps: true, collection: 'restaurants' })
export class Restaurant {

    @Prop({ type: LocaleTextSchema, required: true })
    name: LocaleText;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    slug: string;

    @Prop({
        type: [String],
        enum: Cuisine,
        required: true,
        validate: {
            validator: (v: string[]) => v.length >= 1 && v.length <= 3,
            message: 'A restaurant must have between 1 and 3 cuisines',
        },
    })
    cuisines: Cuisine[];

    @Prop({
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    })
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.index({ location: '2dsphere' });