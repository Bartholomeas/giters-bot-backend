import { Module } from '@nestjs/common';
import { KickAuthModule } from './auth/kick-auth.module';
import { KickCategoriesModule } from './categories/kick-categories.module';

@Module({
  imports: [KickAuthModule, KickCategoriesModule],
  exports: [KickAuthModule, KickCategoriesModule],
})
export class KickModule {}
