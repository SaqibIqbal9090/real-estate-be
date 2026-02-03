import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Sequelize } from 'sequelize-typescript';
import { HarImporter } from '../scripts/har-import';

@Injectable()
export class HarCronService {
    private readonly logger = new Logger(HarCronService.name);

    constructor(private readonly sequelize: Sequelize) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleDailyImport() {
        this.logger.log('Starting daily HAR import job...');
        try {
            // Create importer instance injecting the existing Sequelize connection
            const importer = new HarImporter(this.sequelize);

            // Import 1000 records as requested
            // The HarImporter might be using environment variables for other configs like batch size,
            // but MAX_LISTINGS was passed in the main function of the script.
            // HarImporter.importListings() accepts maxListings argument.
            await importer.importListings(1000);

            this.logger.log('Daily HAR import job completed successfully.');
        } catch (error) {
            this.logger.error('Failed the daily HAR import job', error);
        }
    }
}
