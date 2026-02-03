import { Module } from '@nestjs/common';
import { HarCronService } from './har-cron.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [HarCronService],
    exports: [HarCronService],
})
export class SchedulerModule { }
