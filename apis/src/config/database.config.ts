/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
// import { DataSourceOptions } from 'typeorm';

/**
 * Database configuration for the application
 * Auto-loads entities from modules directory
 */
export default registerAs('database', (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    type: (process.env.DB_TYPE as any) || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'kine_saas',
    entities: [
      join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}'),
      join(__dirname, '..', 'users', '**', '*.entity.{ts,js}'),
      join(__dirname, '..', 'kinesitherapeute', '**', '*.entity.{ts,js}'),
    ],
    migrations: [join(__dirname, '..', 'database', 'migrations', '*.{ts,js}')],
    synchronize: true,
    logging:
      process.env.DB_LOGGING === 'true' ||
      process.env.NODE_ENV === 'development',
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
});
