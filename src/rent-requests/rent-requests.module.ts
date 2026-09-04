import { Module } from '@nestjs/common';
import { RentRequestsService } from './rent-requests.service';
import { RentRequestsController } from './rent-requests.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
  ],
  controllers: [RentRequestsController],
  providers: [RentRequestsService],
  exports: [RentRequestsService],
})
export class RentRequestsModule {}
