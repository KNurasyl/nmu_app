import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { CreateTaskInput } from './create-task.input';

@InputType()
export class UpdateTaskInput extends PartialType(CreateTaskInput) {
  @Field(() => Int)
  @IsMongoId()
  id: string;
}
