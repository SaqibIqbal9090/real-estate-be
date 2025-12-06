import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SellRequestsService } from './sell-requests.service';
import { SellRequestsController } from './sell-requests.controller';
import { SellRequest } from './sell-request.model';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([SellRequest]),
    AuthModule,
    UsersModule,
  ],
  controllers: [SellRequestsController],
  providers: [SellRequestsService],
  exports: [SellRequestsService, SequelizeModule],
})
export class SellRequestsModule {}





