import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-type-json';
import mongoose from 'mongoose';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Task {
  @Field(() => String)
  _id: string;

  @Prop({ required: true })
  @Field()
  type: string;

  @Prop({ required: true })
  @Field()
  lessonId: string;

  @Prop({ required: false })
  @Field({ nullable: true })
  description?: string;

  @Prop({ type: [Object], required: true })
  @Field(() => [GraphQLJSONObject])
  data: Record<string, any>[];

  @Field(() => Lesson)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' })
  lesson: Lesson;
}

export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.set('toObject', { virtuals: true });
TaskSchema.set('toJSON', { virtuals: true });
