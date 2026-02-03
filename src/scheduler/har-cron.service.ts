import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { spawn } from 'child_process';

@Injectable()
export class HarCronService {
    private readonly logger = new Logger(HarCronService.name);

    constructor() { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    handleDailyImport() {
        this.logger.log('Starting daily HAR import job via child process...');

        // Spawn a child process to run the import script
        // MAX_LISTINGS=1000 npm run har:import

        const child = spawn('npm', ['run', 'har:import'], {
            env: { ...process.env, MAX_LISTINGS: '1000' },
            shell: true,
            cwd: process.cwd(),
        });

        child.stdout.on('data', (data) => {
            this.logger.log(`[HAR Import]: ${data.toString().trim()}`);
        });

        child.stderr.on('data', (data) => {
            this.logger.error(`[HAR Import Error]: ${data.toString().trim()}`);
        });

        child.on('close', (code) => {
            if (code === 0) {
                this.logger.log(`Daily HAR import job completed successfully (exit code ${code}).`);
            } else {
                this.logger.error(`Daily HAR import job failed with exit code ${code}.`);
            }
        });

        child.on('error', (err) => {
            this.logger.error('Failed to start HAR import child process', err);
        });
    }
}
