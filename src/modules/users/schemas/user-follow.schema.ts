import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserFollowDocument = UserFollow & Document;

@Schema({ timestamps: true, collection: 'user_follows' })
export class UserFollow {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Types.ObjectId;
}

export const UserFollowSchema = SchemaFactory.createForClass(UserFollow);

UserFollowSchema.index({ user: 1, restaurant: 1 }, { unique: true });

UserFollowSchema.index({ user: 1 });

UserFollowSchema.index({ restaurant: 1 });
