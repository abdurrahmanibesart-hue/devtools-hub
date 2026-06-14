import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { LinkDoc, LinkSchema } from './schemas/link.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LinkDoc.name, schema: LinkSchema }]),
  ],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}
