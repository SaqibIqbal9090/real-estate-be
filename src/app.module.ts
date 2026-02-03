import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { BuyRequestsModule } from './buy-requests/buy-requests.module';
import { SellRequestsModule } from './sell-requests/sell-requests.module';
import { ContactModule } from './contact/contact.module';
import { databaseConfig } from './config/database.config';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot(databaseConfig),
    AuthModule,
    PropertiesModule,
    BuyRequestsModule,
    SellRequestsModule,
    ContactModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
