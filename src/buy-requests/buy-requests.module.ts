import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BuyRequestsService } from './buy-requests.service';
import { BuyRequestsController } from './buy-requests.controller';
import { BuyRequest } from './buy-request.model';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([BuyRequest]),
    AuthModule,
    UsersModule,
  ],
  controllers: [BuyRequestsController],
  providers: [BuyRequestsService],
  exports: [BuyRequestsService, SequelizeModule],
})
export class BuyRequestsModule {}

