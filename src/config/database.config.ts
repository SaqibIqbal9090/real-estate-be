import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'real_estate',
  // RDS/Aurora enforces SSL (rds.force_ssl); local Postgres doesn't speak it.
  // Set DB_SSL=true in environments that connect to RDS.
  ...(process.env.DB_SSL === 'true'
    ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
    : {}),
  autoLoadModels: true,

  // Temporarily enable synchronize to recreate tables after PostgreSQL reinstall
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  pool: {
    // 5 was too small: concurrent listing requests (and the sitemap build,
    // which fans out dozens of counts) queued behind each other.
    max: parseInt(process.env.DB_POOL_MAX ?? '20', 10),
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
};

// Surface the resolved target at boot. A silent fallback to localhost is what
// previously left the app and the HAR importer reading different databases.
console.log(
  `[database] connecting to host=${databaseConfig.host} db=${databaseConfig.database} ssl=${process.env.DB_SSL === 'true'}`,
);
