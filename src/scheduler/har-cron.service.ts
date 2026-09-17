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

        this.logger.log('Starting periodic HAR incremental sync...');

        // har:sync fetches only listings changed since the last run and upserts
        // them, so status/price/photo changes are picked up. The old har:import
        // walked the whole feed and only inserted, which left sold listings
        // published and prices stale.
        const child = spawn('npm', ['run', 'har:sync'], {
            env: { ...process.env },
            shell: true,
            cwd: process.cwd(),
        });

        child.stdout.on('data', (data) => {
            this.logger.log(`[HAR Sync]: ${data.toString().trim()}`);
        });

        child.stderr.on('data', (data) => {
            // npm and Sequelize write warnings to stderr; only surface real
            // failures as errors so the logs stay readable.
            const text = data.toString().trim();
            if (/error|failed|fatal/i.test(text)) {
                this.logger.error(`[HAR Sync Error]: ${text}`);
            } else {
                this.logger.debug(`[HAR Sync]: ${text}`);
            }
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
