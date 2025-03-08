import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

console.log(process.env.DB_NAME);
export const mikroOrmConfig: MikroOrmModuleSyncOptions = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  colors: true,
  driver: PostgreSqlDriver,
};
