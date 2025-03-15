import { Module } from '@nestjs/common';
import { KickCategoriesService } from './services/kick-categories.service';
import { KickCategoriesController } from './kick-categories.controller';

@Module({
  providers: [KickCategoriesService],
  exports: [KickCategoriesService],
  controllers: [KickCategoriesController],
})
export class KickCategoriesModule {}
