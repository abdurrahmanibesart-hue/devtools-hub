import { Module } from '@nestjs/common';
import { LinksModule } from '../links/links.module';
import { AdminLinksController } from './admin-links.controller';

@Module({
  imports: [LinksModule],
  controllers: [AdminLinksController],
})
export class AdminModule {}
