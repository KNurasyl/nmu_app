import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateLessonInput {
  @Field()
  @IsString({ message: 'Lesson name must be string' })
  lessonName: string;

  @Field()
  @IsOptional()
  @IsString({ message: 'Description name must be string' })
  description: string;

  @Field()
  @IsOptional()
  videoUrl: string;
}
