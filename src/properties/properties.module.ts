import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from './property.model';
import { S3Service } from './s3.service';

@Module({
  imports: [SequelizeModule.forFeature([Property])],
  controllers: [PropertiesController],
  providers: [PropertiesService, S3Service],
  exports: [PropertiesService, SequelizeModule],
})
export class PropertiesModule {} 