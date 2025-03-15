import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { KickCategoriesService } from './services/kick-categories.service';
import { Request } from 'express';
import { BearerToken } from 'src/common/decorators/bearer-token.decorator';

@Controller('categories')
export class KickCategoriesController {
  constructor(private readonly categoriesService: KickCategoriesService) {}

  @Get()
  async getCategories(
    @Query('search') search: string,
    @BearerToken() token: string,
  ) {
    return this.categoriesService.getCategories(search ?? '', token);
  }
  @Get('/:categoryId')
  async getCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @BearerToken() token: string,
  ) {
    return this.categoriesService.getCategory(categoryId, token);
  }
}
