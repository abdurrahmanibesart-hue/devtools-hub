import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Link } from './entities/link.entity';
import { LinksService } from './links.service';

@ApiTags('links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  @ApiOkResponse({ type: [Link] })
  findAll(): Promise<Link[]> {
    return this.linksService.findAll(true);
  }
}
