import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { mikroOrmConfig } from 'mikro-orm.config';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { KickAuthModule } from './kick-auth/kick-auth.module';

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
    AuthModule,
    KickAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
