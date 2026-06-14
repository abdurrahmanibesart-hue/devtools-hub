import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class LinkGql {
  @Field(() => ID) id: string;
  @Field() title: string;
  @Field() url: string;
  @Field() description: string;
  @Field() category: string;
  @Field() isActive: boolean;
  @Field() createdAt: string;
  @Field() updatedAt: string;
}
