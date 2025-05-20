import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateTaskInput {
  @Field()
  type: string;

  @Field()
  lessonId: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [GraphQLJSONObject])
  data: Record<string, any>[];
}
