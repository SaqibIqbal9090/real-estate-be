import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { spawn } from 'child_process';

@Injectable()
export class HarCronService {
    private readonly logger = new Logger(HarCronService.name);

    constructor(private readonly configService: ConfigService) { }

    @Cron('0 */2 * * *')
    handlePeriodicImport() {
        const runHarCron = this.configService.get<string>('RUN_HAR_CRON');

        if (runHarCron !== 'true') {
            this.logger.log('Skipping periodic HAR import job because RUN_HAR_CRON is not set to true.');
            return;
        }

        this.logger.log('Starting periodic HAR import job via child process (200 records)...');

        // Spawn a child process to run the import script
        // MAX_LISTINGS=200 npm run har:import

        const child = spawn('npm', ['run', 'har:import'], {
            env: { ...process.env, MAX_LISTINGS: '200' },
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
                this.logger.log(`Periodic HAR import job completed successfully (exit code ${code}).`);
            } else {
                this.logger.error(`Periodic HAR import job failed with exit code ${code}.`);
            }
        });

        child.on('error', (err) => {
            this.logger.error('Failed to start HAR import child process', err);
        });
    }
}
