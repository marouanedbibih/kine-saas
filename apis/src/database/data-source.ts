/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config();

// Create app data source for TypeORM CLI and migrations
export const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE as any) || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'kine_saas',
  entities: [
    join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}'),
    join(__dirname, '..', 'users', '**', '*.entity.{ts,js}'),
    join(__dirname, '..', 'kinesitherapeute', '**', '*.entity.{ts,js}'),
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
});
