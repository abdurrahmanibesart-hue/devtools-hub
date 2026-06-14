import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUrl,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsString,
  IsEnum,
} from 'class-validator';
import { LinkCategory } from '../enums/link-category.enum';

export class CreateLinkDto {
  @ApiProperty({ example: 'Grafana', maxLength: 80 })
  @IsString()
  @MaxLength(80)
  title: string;

  @ApiProperty({ example: 'https://grafana.example.com' })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({ example: 'Application metrics and dashboards' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: LinkCategory, default: LinkCategory.General })
  @IsOptional()
  @IsEnum(LinkCategory)
  category?: LinkCategory;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
