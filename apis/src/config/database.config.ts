/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConsentDocument } from '@/modules/documents/consent-document.entity';
import { EmergencyContact } from '@/modules/emergency-contact/emergency-contact.entity';
import { InsuranceInfo } from '@/modules/insurance-info/insurance-info.entity';
import { MedicalRecord } from '@/modules/medical-record/medical-record.entity';
import { Patient } from '@/modules/patient/patient.entity';
import { User } from '@/modules/users/entities/user.entity';
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
      User,
      Patient,
      ConsentDocument,
      EmergencyContact,
      InsuranceInfo,
      MedicalRecord,
      // Kinesitherapeute,
    ],
    migrations: [join(__dirname, '..', 'database', 'migrations', '*.{ts,js}')],
    synchronize: true,
    dropSchema: true,
    logging:
      process.env.DB_LOGGING === 'true' ||
      process.env.NODE_ENV === 'development',
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
});
