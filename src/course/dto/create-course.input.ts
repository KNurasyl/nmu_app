import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCourseInput {
  @Field()
  @IsString({ message: 'Course name must be string' })
  courseName: string;

  @Field()
  @IsOptional()
  @IsString({ message: 'Description name must be string' })
  description: string;
}
