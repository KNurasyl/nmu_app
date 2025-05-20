import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { CreateLessonInput } from './create-lesson.input';

@InputType()
export class UpdateLessonInput extends PartialType(CreateLessonInput) {
  @Field(() => Int)
  @IsMongoId()
  id: string;
}
