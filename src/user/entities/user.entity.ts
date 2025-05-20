import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop()
  userName: string;

  @Field()
  @Prop()
  userRole: string;

  @Field()
  @Prop()
  phoneNumber: string;

  @Prop()
  password: string;

  @Prop({ default: null })
  refreshToken?: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
