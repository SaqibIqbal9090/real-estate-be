import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InsuranceService } from './insurance.service';
import { InsuranceController } from './insurance.controller';
import { InsuranceRequest } from './insurance-request.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([InsuranceRequest]), AuthModule],
  controllers: [InsuranceController],
  providers: [InsuranceService],
  exports: [InsuranceService, SequelizeModule],
})
export class InsuranceModule {}
