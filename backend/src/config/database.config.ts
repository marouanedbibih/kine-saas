import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { Kinesitherapeute } from 'src/practitioners/entities/kinesitherapeute.entity';
import { User } from 'src/users/entities/user.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT!, 10) || 5433,
    username: process.env.DB_USERNAME || 'kine_user',
    password: process.env.DB_PASSWORD || 'kine_password',
    database: process.env.DB_NAME || 'kine_db',
    entities: [User, Patient, Kinesitherapeute],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
  }),
);
