import { ApiProperty } from '@nestjs/swagger';
import { LinkCategory } from '../enums/link-category.enum';

export class Link {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() url: string;
  @ApiProperty() description: string;
  @ApiProperty({ enum: LinkCategory }) category: LinkCategory;
  @ApiProperty() isActive: boolean;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}
