import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLinkDto } from '../links/dto/create-link.dto';
import { UpdateLinkDto } from '../links/dto/update-link.dto';
import { Link } from '../links/entities/link.entity';
import { LinksService } from '../links/links.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/links')
export class AdminLinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  @ApiOkResponse({ type: [Link] })
  findAll(): Promise<Link[]> {
    return this.linksService.findAll(false);
  }

  @Post()
  @ApiCreatedResponse({ type: Link })
  create(@Body() dto: CreateLinkDto): Promise<Link> {
    return this.linksService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a link' })
  @ApiOkResponse({ type: Link })
  @ApiNotFoundResponse()
  update(@Param('id') id: string, @Body() dto: UpdateLinkDto): Promise<Link> {
    return this.linksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a link' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  remove(@Param('id') id: string): Promise<void> {
    return this.linksService.remove(id);
  }
}
