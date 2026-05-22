import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Cuisine } from '../../../enums/cuisine.enum.js';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({
    type: [String],
    enum: Cuisine,
    required: true,
    validate: {
      validator: (v: string[]) => v.length >= 1,
      message: 'User must have at least one favorite cuisine',
    },
  })
  favoriteCuisines: Cuisine[];
}

export const UserSchema = SchemaFactory.createForClass(User);
