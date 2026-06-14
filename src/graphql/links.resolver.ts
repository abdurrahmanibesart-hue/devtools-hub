import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { LinkGql } from './models/link.model';
import { LinksService } from '../links/links.service';

@Resolver(() => LinkGql)
export class LinksResolver {
  constructor(private readonly linksService: LinksService) {}

  @Query(() => [LinkGql], { name: 'links' })
  findAll(): Promise<LinkGql[]> {
    return this.linksService.findAll(true) as Promise<LinkGql[]>;
  }

  @Query(() => LinkGql, { name: 'link', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<LinkGql | null> {
    return this.linksService.findById(id) as Promise<LinkGql | null>;
  }
}
