import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class Lesson {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop()
  lessonName: string;

  @Field()
  @Prop()
  lang: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field({ nullable: true })
  @Prop()
  videoUrl?: string;

  @Field()
  @Prop()
  order: number;
}

export type LessonDocument = Lesson & Document;
export const LessonSchema = SchemaFactory.createForClass(Lesson);
