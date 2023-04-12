import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizationModule, ClockInModule, UserModule } from './domain';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Constants } from './shared/config/constants';
import { ConfigModule } from '@nestjs/config';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ClockInModule,
    UserModule,
    AuthorizationModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: Constants.DB_HOST,
      port: Constants.DB_PORT,
      username: Constants.DB_USERNAME,
      password: Constants.DB_PASSWORD,
      database: Constants.DB_DATABASE,
      entities: [__dirname + './shared/**/*.entity.js'],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
