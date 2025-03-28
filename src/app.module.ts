import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { mikroOrmConfig } from 'mikro-orm.config';
import { ChatModule } from './chat/chat.module';
import { KickModule } from './kick/kick.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        if (!config.DB_NAME) {
          throw new Error('DB_NAME is not defined');
        }
        return config;
      },
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    ChatModule,
    KickModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
